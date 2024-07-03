define([
    'jquery', 
    'uiComponent', 
    'Thecommerceshop_Predictivesearch/js/config/typesenseSearchConfig',
    'Thecommerceshop_Predictivesearch/js/component/multi-search',
    'Thecommerceshop_Predictivesearch/js/component/products',
    'Thecommerceshop_Predictivesearch/js/component/category',
    'Thecommerceshop_Predictivesearch/js/component/pages',
    'mage/url',
    'ko'
], function ($, Component, searchConfig, multiSearchComponent, productComponent, categoryComponent, pageComponent, url, ko) {
    'use strict';
    
    let keyword = '';
    let showCategory = false;
    let showPage = false;
    let showSuggestion = false;
    let searchUrl = BASE_URL+'catalogsearch/result/?q=';
    let cookieName ='_conversion_box_track_id';
    let sessionID='';

    let mimimumqueryLength = typesenseConfig.auto_complete.minimum_char_length;
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
         this.getSessionID();
            //search action
            $( "#searchbox" ).on("keyup", function(e) {
                keyword = e.target.value;
                var keywordlength = keyword.length;
                if (keyword && (keywordlength >= mimimumqueryLength) ) {
                    //enabling the search popup
                   
                    //bind product, category and page data and suggestion data
                    multiSearchComponent.multiSearch(keyword, typsenseClient);
                     $("#search_result").css("display", "flex");
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
            $("#searchbox").click(function() {
               if (keyword) {
                    if ($('#search_result').is(':hidden')) {
                        $('#search_result').show();
                    } else {
                        $('#search_result').hide();
                    }
                }
            });
        },
     getSessionID: function() {
    let cookieID =  this.getCookie('_conversion_box_track_id');
    let storageId = localStorage.getItem('_conversion_box_track_id');
    
    if (!cookieID && storageId) {
        sessionID = storageId;
        setCookie("_conversion_box_track_id", storageId);
    } else if (!storageId && cookieID) {
        sessionID = cookieID;
        localStorage.setItem("_conversion_box_track_id", cookieID);
    } else if (!cookieID && !storageId) {
        sessionID = uuid4();
        this.setCookie("_conversion_box_track_id", sessionID);
        localStorage.setItem("_conversion_box_track_id", sessionID);
    } else {
        sessionID = cookieID;
    }
} ,
getCookie: function(name){
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    },


    setCookie: function(cookieKey, cookieValue) {
        // Set the session ID in a cookie with a longer expiration time (e.g., 30 days)
        document.cookie = `${cookieKey}=${cookieValue}; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
    },


    setLocalStorage: function(storageKey, storageValue)  {
        // Store the session ID in local storage for persistence
        localStorage.setItem(storageKey, storageValue);
    },


    });
});
