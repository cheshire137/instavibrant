# encoding=utf-8
require 'sinatra'
require 'net/http'
require 'logger'
require 'uri'
require 'json'

enable :sessions, :logging
set :protection, except: [:json_csrf]

before do
  logger.level = Logger::DEBUG
  headers({'Access-Control-Allow-Origin' => ENV['FRONT_END_URI']})
end

set :public_folder, 'dist'
use Rack::Static, urls: ['/styles', '/scripts/**/*.js', '/images',
                         '/bower_components'], root: settings.public_folder

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

# For Heroku where the API URL and front end URL are the same
get '/scripts/config.json' do
  content_type 'application/json'
  {
    localStorageKey: ENV['LOCAL_STORAGE_KEY'],
    serverUrl: ENV['FRONT_END_URI'],
    instagram: {
      clientId: ENV['INSTAGRAM_CLIENT_ID'],
      redirectUri: ENV['FRONT_END_URI']
    }
  }.to_json
end

options '/image' do
  ''
end

get '/image' do
  url = params[:url] || ''
  unless url.start_with?('http://') || url.start_with?('https://')
    return 'Invalid URL'
  end
  uri = URI.parse(url)
  http = Net::HTTP.new(uri.host, uri.port)
  if uri.scheme == 'https'
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER
  end
  begin
    response = http.request(Net::HTTP::Get.new(uri.request_uri))
  rescue SocketError => ex
    status 404
    return 'Could not load URL'
  end
  case response
  when Net::HTTPOK
    content_type response['content-type']
    response.body
  else
    status 422
    response.body
  end
end
