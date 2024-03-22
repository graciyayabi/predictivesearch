define(
    [
        'jquery',
        'jquery/ui',
        'Thecommerceshop_Predictivesearch/js/config/typesenseSearchConfig',
        'mage/url'
    ], function ($, ui, searchConfig, urlFormatter) {
        const SEARCHBLE_ATTRIBUTES = typesenseConfig.products.attributes;
        const INDEX_PERFIX = typesenseConfig.general.indexprefix;
        const STORE = typesenseConfig.general.storeCode;
        const CATEGORY = typesenseConfig.category.name;
        return {
            /**
             * 
             * @param {*} keyword 
             * @param {*} typsenseClient 
             */
            sliderPrice: async function(keyword, location) {
                try {
                    let searchAttributes = SEARCHBLE_ATTRIBUTES.map((item) => {
                        if (item.search == 1) {
                            return item.code;
                        }
                    });
                    searchAttributes = searchAttributes.join(',');
                    if (keyword) {
                        keyword = keyword.replace(/%20/g, " ");
                    }
                    //preparing search params
                    let searchParameters = {
                        'q'         : keyword,
                        'query_by'  : searchAttributes,
                        'facet_by'  : 'price',
                    }
                    if (location == 'listing') {
                        searchParameters.filter_by = `category_ids:["${CATEGORY}"]`;
                    }
    
                    const typsenseClient = searchConfig.createClient(typesenseConfig);
                    return typsenseClient.collections(INDEX_PERFIX+STORE+'-products').documents().search(searchParameters).then((searchResults) => {
                        return searchResults.facet_counts[0].stats;
                    });
                } catch (error) {
                    console.log(error)
                }
            },
        };
    }
);
