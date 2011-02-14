require File.expand_path(File.join('..', 'spec_helper'), File.dirname(__FILE__))

describe Rwiki::App do
  include Rwiki
  include Rack::Test::Methods

  def app
    Rwiki::App
  end

  def self.it_should_respond_with_success
    it 'should respond with success' do
      last_response.should be_ok
    end
  end

  describe 'on GET to /' do
    before { get '/' }
    it_should_respond_with_success
  end

  describe 'on GET to /nodes' do
    before { get '/nodes', :path => '.' }
    it_should_respond_with_success
  end

  describe 'on GET to /node' do
    context 'for non-existing page' do
      before { get '/node', :path => 'Non-existing' }
      it_should_respond_with_success
    end

    context 'for existing page' do
      before { get '/node', :path => '/Home/Development/Programming Languages/Ruby' }
      it_should_respond_with_success
    end
  end

  describe 'on PUT to /node' do
    before { put '/node', :path => '/Home/Development', :rawContent => 'h1. The new page content' }
    it_should_respond_with_success
  end

  describe 'on PUT to /node/move' do
    before { put '/node/move', :newParentPath => '/Home/Personal stuff', :path => '/Home/Development' }
    it_should_respond_with_success
  end

  describe 'on DELETE to /node' do
    before { delete '/node', :path => '/Home/Development' }
    it_should_respond_with_success
  end

end