define(
    [
        'jquery', 
        'uiComponent', 
        'Thecommerceshop_Predictivesearch/js/config/typesenseSearchConfig',
        'Thecommerceshop_Predictivesearch/js/component/products',
        'Thecommerceshop_Predictivesearch/js/component/category',
        'Thecommerceshop_Predictivesearch/js/component/pages',
        'Thecommerceshop_Predictivesearch/js/component/suggestions',
        'mage/url',
        'ko'
    ], function ($, Component, searchConfig, productComponent, categoryComponent, pageComponent, suggestionComponent, url, ko) {
    'use strict';
    
    let keyword = '';
    let showCategory = false;
    let showPage = false;
    let showSuggestion = false;
    let searchUrl = BASE_URL+'catalogsearch/result/?q=';
    //initialize the typsense client
    const typsenseClient = searchConfig.createClient(typesenseConfig);
    const CATEGORY_SECTION = typesenseConfig.auto_complete.category_enabled;
    if (CATEGORY_SECTION == 1) {
        showCategory = true;
    }
    const PAGE_SECTION = typesenseConfig.auto_complete.pages_enabled;
    if (PAGE_SECTION == 1) {
        showPage = true;
    }

    const SUGGESTION_SECTION = typesenseConfig.auto_complete.suggestions;
    if (SUGGESTION_SECTION == 1) {
        showSuggestion = true;
    }
    
    return Component.extend({
        defaults: {
            template: 'Thecommerceshop_Predictivesearch/searchTemplate'
        },
        searchPage: ko.observable(keyword),
        categorySection: ko.observable(showCategory),
        pageSection: ko.observable(showPage),
        suggestionSection: ko.observable(showSuggestion),

        initialize: function () {
            var self = this;
            this._super();
         
            /** return if configuration value not set **/
            if (typeof typesenseConfig === 'undefined' || !typesenseConfig.general.enabled) {
                return;
            }
            
            //search action
            $( "#searchbox" ).on("keyup", function(e) {
                keyword = e.target.value;
                if (keyword) {
                    //enabling the search popup
                    $("#search_result").css("display", "flex");
                    
                    //bind product data
                    productComponent.producSearch(keyword, typsenseClient);
                    //bind category data
                    categoryComponent.categorySearch(keyword, typsenseClient);
                    //bind pages data
                    pageComponent.cmsSearch(keyword, typsenseClient);
                    //bind suggestions
                    suggestionComponent.suggestions(keyword, typsenseClient);
                } else {
                    $('#product_section').html('');
                    $('#cms_section').html('');
                    $('#category_section').html('');
                    $("#search_result").css("display", "none");
                }
            
                self.searchPage(searchUrl+keyword)
            });

            //enter key action
            $('#searchbox').keypress((e) => {
                // Enter key corresponds to number 13
                if (e.which === 13) {
                    window.location = url.build('catalogsearch/result/?q='+e.target.value);
                }
            });

            //popup toogle action when clicking on search box
            $("body").click(function() {
               if (keyword) {
                    if ($('#search_result').is(':hidden')) {
                        $('#search_result').show();
                    } else {
                        $('#search_result').hide();
                    }
                }
            });
        },
    });
});
