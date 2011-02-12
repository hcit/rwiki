module TmpdirHelper
  TMP_DIR = '/tmp/rwiki_test'

  def tmp_dir
    TMP_DIR
  end

  def create_tmpdir!
    FileUtils.mkdir_p(tmp_dir)
    pages_dir = File.expand_path(File.join('..', 'fixtures', 'pages'), __FILE__)
    FileUtils.cp_r(pages_dir, tmp_dir)

    # change working directory to the wiki root
    Rwiki.configuration.rwiki_path = File.join(tmp_dir, 'pages')
  end

  def remove_tmpdir!
    FileUtils.rm_rf(tmp_dir)
  end
end