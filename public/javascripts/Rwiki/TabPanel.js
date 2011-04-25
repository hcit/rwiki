Ext.ns('Rwiki');

Rwiki.TabPanel = Ext.extend(Ext.TabPanel, {

  initComponent: function() {
    this.toolbar = new Rwiki.Tabs.Toolbar();

    Ext.apply(this, {
      region: 'center',
      deferredRender: false,
      activeTab: 0,
      enableTabScroll: true,
      defaults: {
        autoScroll: true
      },
      plugins: new Ext.ux.TabCloseMenu(),
      tbar: this.toolbar
    });

    Rwiki.TabPanel.superclass.initComponent.apply(this, arguments);
  },

  initEvents: function() {
    Rwiki.TabPanel.superclass.initEvents.apply(this, arguments);

    this.addEvents('rwiki:editPage');

    this.on('rwiki:pageSelected', this.onPageSelected),
    this.on('tabchange', this.onTabChange);

    this.on('rwiki:pageCreated', this.onPageCreated);
    this.on('rwiki:pageLoaded', this.onPageLoaded);
    this.on('rwiki:lastPageClosed', this.onLastPageClosed);
    this.on('rwiki:beforePageSave', this.onBeforePageSave);
    this.on('rwiki:pageSaved', this.onPageSaved);
    this.on('rwiki:pageRenamed', this.onPageRenamed);
    this.on('rwiki:pageDeleted', this.onPageDeleted);

    this.relayEvents(Rwiki.Data.PageManager.getInstance(), [
      'rwiki:pageLoaded',
      'rwiki:pageCreated',
      'rwiki:lastPageClosed',
      'rwiki:beforePageSave',
      'rwiki:pageSaved',
      'rwiki:pageRenamed',
      'rwiki:pageDeleted'
    ]);

    this.on('rwiki:toolbar:editPage', this.onEditPage);
    this.on('rwiki:toolbar:printPage', this.onPrintPage);

    this.relayEvents(this.toolbar, [
      'rwiki:toolbar:editPage',
      'rwiki:toolbar:printPage'
    ]);
  },

  findOrCreatePageTab: function(page) {
    var tab = this.findTabByPagePath(page.getPath());
    if (!tab) {
      tab = this.createPageTab(page);
    }

    return tab;
  },

  createPageTab: function(page) {
    var tab = new Rwiki.Tabs.PageTab({
      title: page.getTitle()
    });

    tab.setPagePath(page.getPath());
    this.add(tab);

    return tab;
  },

  findTabByPagePath: function(pagePath) {
    return this.findBy(function() {
      return this.getPagePath() == pagePath;
    })[0];
  },

  findTabsByParentPath: function(parentPath) {
    return this.findBy(function() {
      var path = this.getPagePath();
      return Rwiki.Data.PageManager.getInstance().isParent(parentPath, path);
    });
  },

  getToolbar: function() {
    return this.toolbar;
  },

  onPageSelected: function(page) {
    var tab = this.findOrCreatePageTab(page);
    tab.show();
  },

  onTabChange: function(panel, tab) {
    if (tab) {
      if (tab.isLoading()) {
        return;
      }

      Rwiki.setAppTitle(tab.getPagePath());
      Rwiki.Data.PageManager.getInstance().loadPage(tab.getPagePath());
      tab.setIsLoading(true);
    } else {
      Rwiki.setAppTitle('');
      Rwiki.Data.PageManager.getInstance().fireEvent('rwiki:lastPageClosed');
    }
  },

  onPageCreated: function(page) {
    var tab = this.createPageTab(page);
    tab.show();
  },

  onPageLoaded: function(page) {
    var tab = this.findOrCreatePageTab(page);

    tab.setTitle(page.getTitle());
    tab.setContent(page.getHtmlContent());

    tab.setIsLoading(false);
    this.toolbar.enablePageRelatedItems();
  },

  onLastPageClosed: function() {
    this.toolbar.disablePageRelatedItems();
  },

  onBeforePageSave: function(page) {
    var tab = this.findTabByPagePath(page.getPath());
    if (tab == null) return;

    tab.setIsLoading(true);
  },

  onPageSaved: function(page) {
    var tab = this.findTabByPagePath(page.getPath());
    if (tab == null) return;

    tab.setIsLoading(false);
    tab.setContent(page.getHtmlContent());
  },

  onPageRenamed: function(page) {
    var oldPath = page.getData().oldPath;
    var currentTab = this.getActiveTab();

    // set a new title and path for the current tab
    var tab = this.findTabByPagePath(oldPath);
    if (tab) {
      tab.setPagePath(page.getPath());
      tab.setTitle(page.getTitle());

      if (tab == currentTab) {
        Rwiki.setAppTitle(page.getPath());
      }
    }

    // set a new title and path for all child tabs
    var tabs = this.findTabsByParentPath(oldPath);
    for (var i = 0; i < tabs.length; i++) {
      tab = tabs[i];
      var newPath = tab.getPagePath().replace(oldPath, page.getPath());
      tab.setPagePath(newPath);

      if (tab == currentTab) {
        Rwiki.setAppTitle(page.getPath());
      }
    }
  },

  onPageDeleted: function(page) {
    var tabs = this.findTabsByParentPath(page.getPath());
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      this.remove(tab);
    }
  },

  onEditPage: function() {
    var currentTab = this.getActiveTab();
    if (currentTab) {
      this.fireEvent('rwiki:editPage', currentTab.getPagePath());
    }
  },

  onPrintPage: function() {
    var currentTab = this.getActiveTab();
    if (currentTab) {
      var path = currentTab.getPagePath();
      window.open('/node/print?path=' + path, 'Rwiki ' + path, 'width=800,height=600,scrollbars=yes')
    }
  },

});

