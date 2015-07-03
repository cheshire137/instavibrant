# encoding=utf-8
require 'sinatra'
require 'net/http'
require 'logger'
require 'uri'

enable :sessions, :logging
set :protection, except: [:json_csrf]

before do
  logger.level = Logger::DEBUG
end

if ENV['RACK_ENV'] == 'production'
  set :public_folder, 'dist'
else
  set :public_folder, 'app'
end

use Rack::Static, urls: ['/styles', '/scripts/**/*.js', '/images',
                         '/bower_components'], root: settings.public_folder

# For Heroku
get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/image' do
end
