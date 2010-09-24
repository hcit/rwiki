require File.expand_path(File.dirname(__FILE__) + '../../../helper')

class Rwiki::Models::TestPage < Test::Unit::TestCase
  include Rwiki::Models

  context 'Page construnctor' do
    context 'with path to non-existing file' do
      setup { @file_name = '/.non-existing.txt' }

      should 'raise PageNotFountError' do
        exception = assert_raise Rwiki::PageNotFoundError do
          Page.new(@file_name)
        end

        assert_equal "cannot find #{@file_name}", exception.message
      end
    end

    context 'with path to the folder' do
      setup { @file_name = './folder' }

      should 'raise PageNotFountError' do
        exception = assert_raise Rwiki::PageNotFoundError do
          Page.new(@file_name)
        end

        assert_equal "cannot find #{@file_name}", exception.message
      end
    end

    context 'with illegal filename' do
      setup { @file_name = './empty_folder/dummy' }

      should 'raise PageNotFountError' do
        exception = assert_raise Rwiki::PageNotFoundError do
          Page.new(@file_name)
        end

        assert_equal "#{@file_name} has illegal name", exception.message
      end
    end
  end

  context 'A page instance' do
    setup { @page = Page.new('./home.txt') }

    context 'raw_content method' do
      should 'return valid raw_content' do
        assert @page.raw_content
        assert_equal 'h1. Sample page', @page.raw_content
      end
    end

    context 'html_content method' do
      should 'return valid html_content' do
        assert @page.html_content
        # TODO extend this test
      end
    end

    context 'title method' do
      should 'return valid title' do
        assert_equal 'home', @page.title
      end
    end
  end


end
