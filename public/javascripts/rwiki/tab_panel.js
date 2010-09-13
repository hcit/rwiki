Rwiki.TabPanel = Ext.extend(Ext.TabPanel, {
  constructor: function(config) {
    config = Ext.apply({
      region: 'center',
      deferredRender: false,
      activeTab: 0,
      resizeTabs: true,
      minTabWidth: 200,
      enableTabScroll: true,
      defaults: {
        autoScroll: true
      },
      plugins: new Ext.ux.TabCloseMenu()
    }, config);

    Rwiki.TabPanel.superclass.constructor.call(this, config);
  },

  updateOrAddPageTab: function(pageName, htmlContent) {
    var tab = this.findTabByPageName(pageName);
    if (!tab) {
      tab = this.addPageTab(pageName);
    } 

    tab.setContent(htmlContent);
    return tab;
  },

  addPageTab: function(pageName) {
    var pageTab = new Rwiki.TabPanel.PageTab({
      id: pageName,
      title: pageName
    });

    return this.add(pageTab);
  },

  closeRelatedTabs: function(node) {
    var self = this;
    node.cascade(function() {
      var pageName = this.getPageName();
      var tab = self.findTabByPageName(pageName);
      if (tab) {
        self.remove(tab);
      }
    });
  },

  findTabByPageName: function(pageName) {
    return this.find('id', pageName)[0];
  }
});
