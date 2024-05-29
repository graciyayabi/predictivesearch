define(
    [
        'jquery',
        'mage/url',
        'Magento_Catalog/js/price-utils',
    ], function ($, urlFormatter, priceUtils) {
        /**  Index Prefix */
        const INDEX_PERFIX = typesenseConfig.general.indexprefix;

        /** Product Config */
        const PRODUCT_MAX_COUNT = typesenseConfig.auto_complete.no_products;
        const PROD_SEARCHBLE_ATTRIBUTES = typesenseConfig.products.attributes;
        const PROD_RANKING = typesenseConfig.products.ranking;

        /** Category Config */
        const CAT_MAX_COUNT = typesenseConfig.auto_complete.category_count;
        const CAT_SEARCHBLE_ATTRIBUTES = typesenseConfig.category.attributes;
        const CAT_RANKING = typesenseConfig.category.ranking;

        /** Page Config */
        const PAGE_MAX_COUNT = typesenseConfig.auto_complete.pages_count;

        /** Typo Tolerance */
        const TYPO_ENABLED = typesenseConfig.typotolerance.enable;
        const WORD_LENGTH = typesenseConfig.typotolerance.word_length;

        /** Excluded Pages         */
        const EXCUDED_PAGE = typesenseConfig.auto_complete.excluded_page;

        /** General Config */
        const HIGHLIGHTS = typesenseConfig.general.highlights;
        const PLACEHOLDER = typesenseConfig.general.placeholder;
        const STORE = typesenseConfig.general.storeCode;
        const SEMANTIC_SEARCH = typesenseConfig.additional_section.semantic_status;
        const HYBRID_SEARCH = typesenseConfig.additional_section.hybrid_search;
        const POPULAR_TERMS = typesenseConfig.search_terms.data;

        let excludedPageArr = [];
        if (Object.keys(EXCUDED_PAGE).length >= 1) {
            $.each(EXCUDED_PAGE, function (key, item) {
                excludedPageArr.push(item.page)
            });
        }
        

        return {
            /**
             * 
             * @param {*} keyword 
             * @param {*} typsenseClient 
             */
            multiSearch: function(keyword, typsenseClient) {
                try {
                    let searchRequests = {
                        'searches': [
                            getProductAttributes(keyword),
                            getCategoryAttributes(keyword),
                            getPageAttributes(keyword),
                            getQuerySuggestions(keyword)
                        ]
                    }
                    let commonSearchParams = {}
                    $.when(typsenseClient.multiSearch.perform(searchRequests, commonSearchParams)).done(function(searchResults) {
                        $.each(searchResults.results, function(index, value) {
                            if (value.request_params.collection_name === INDEX_PERFIX+STORE+'-products') {
                                renderProducts(value.hits, value.found);
                            }
                            if (value.request_params.collection_name === INDEX_PERFIX+STORE+'-categories') {
                                renderCategory(value.hits);
                            }
                            if (value.request_params.collection_name === INDEX_PERFIX+STORE+'-pages') {
                                renderPages(value.hits);
                            }

                            if (value.request_params.collection_name === INDEX_PERFIX+STORE+'-suggestions') {
                                renderSuggestions(value.hits);
                            }

                        });
                    });
                } catch (error) {
                    console.log(error)
                }
            }
        };

        /**
         * 
         * @param string keyword 
         */
          function getQuerySuggestions(keyword) {
    
            let suggestions = {
                'collection': INDEX_PERFIX+STORE+'-suggestions',
                'q'         : keyword,
                'query_by'  : 'q',
                'per_page'  : typesenseConfig.auto_complete.suggestions_count
            }            

            return suggestions;
        }

        /**
         * 
         * @param {*} hits 
         */
        function renderSuggestions(hits) {
            let html = '';
            if (hits.length < 1) {
                let htmlhead = '<div class="popular_search_head">Popular Searches </div>';
                $.each(POPULAR_TERMS, function (key, val) {
                    let valkeyword = val.split(" ")[0];
                    html += `
                        <a href="${urlFormatter.build('catalogsearch/result/?q='+val)}">
                            <div class="popular_items">${val.toUpperCase()}</div>
                        </a>
                    `
                });
                html = htmlhead+html;
            }

            $.each(hits, function (key, val) {
                let name = val.document.q;
                if (HIGHLIGHTS == 1) {
                    name = val.highlight.q.snippet;
                }
                html += ` <div class="suggestion_container">
                    <a href="${urlFormatter.build('catalogsearch/result/?q='+val.document.q)}">
                        <div class="suggest_category">${name}</div>
                    </a>
                </div>`;
            });
            $('#suggestion_section').html(html);
        }

        /**
         * 
         * @param string keyword 
         */
        function getProductAttributes(keyword) {
            let productSearchAttributes = PROD_SEARCHBLE_ATTRIBUTES.map((item) => {
                if (item.search == 1) {
                    return item.code;
                }
            });
            productSearchAttributes = productSearchAttributes.join(',');
            let ranking = null;
            if (PROD_RANKING !== false && PROD_RANKING) {
                ranking = PROD_RANKING;
            }
            let productSearchParameters = {
                'collection': INDEX_PERFIX+STORE+'-products',
                'q'         : keyword,
                'query_by'  : productSearchAttributes,
                'per_page'  : PRODUCT_MAX_COUNT,
                'sort_by'   : ranking,
                'filter_by' : `storeCode:["${STORE}"]`,
                'typo_tokens_threshold' : TYPO_ENABLED,
                'num_typos' : 2,
                'min_len_1typo' : WORD_LENGTH,
                'min_len_2typo' : WORD_LENGTH,
            }            
            if (SEMANTIC_SEARCH) {
                productSearchParameters.query_by = 'embedding';
                productSearchParameters.vector_query = 'embedding:([], k:200';
                if (HYBRID_SEARCH == 1) {
                    productSearchParameters.query_by = 'embedding,'+productSearchAttributes;
                }
            }
            $.each(productSearchParameters, function (key, val) {
                if (!val) {
                    delete productSearchParameters[key];
                }
            })
            return productSearchParameters;
        }

        /**
         * 
         * @param {*} hits 
         */
        function renderProducts(hits, found) {
            html = '';
            if (hits.length < 1) {
                html = 'No products found';
            }

            let count = 0;
            $.each(hits, function (key, val) {
                if (val.document.product_status == 1) {
                    let price = val.document.price;
                    if (val.document.special_price) {
                        let currentDate = new Date();
                        let startDate = new Date(val.document.special_from_date);
                        let endDate = new Date(val.document.special_to_date);
                        if (startDate <= currentDate && endDate >= currentDate) {
                            price = `<span class="special_price">${val.document.special_price}</span>
                                 <span class="normal_price">${val.document.price}</span>
                            `;
                        }
                    }
                    var name = val.document.product_name;
                    var sku = val.document.sku;
                    if (typeof val.highlights[0] !== 'undefined'&& HIGHLIGHTS == 1) {
                        var highlight = val.highlights[0].field || false;
                        if (highlight == 'name') {
                            var name = val.highlight.name.snippet;
                        } else if (highlight == 'price') {
                            price  = val.highlight.price.snippet;
                        } else if (highlight == 'sku') {
                            var sku =  val.highlight.sku.snippet;
                        }
                    }

                    let image = null;
                    if (val.document.thumbnail) {
                        image = val.document.thumbnail;
                    } else {
                        image = PLACEHOLDER;
                    }
                    html += `
                        <div class="product-item">
                            <a href="${val.document.url}" >
                                <div class="product-wrapper">
                                    <div class="product-image-div">
                                        <img src="${image}" class="product-image"/>
                                    </div>
                                    <div class="predictive-product_container">
                                        <div class="predictive-product_heading">${name}</div>
                                        <div class="predictive-product_sku">Sku: ${sku}</div>
                                        <div class="predictive-product_price" >`;
                                        if(window.location.href.indexOf("catalogsearch") != -1){
                                            html+=`$${priceUtils.formatPriceLocale(price)}`;
                                        }
                                        else{
                                            html +=`${priceUtils.formatPriceLocale(price)}`;
                                        }
                                        html+=`</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    `;
                    count++;
                    if (count == PRODUCT_MAX_COUNT) {
                        $('.product-viewall').html('View All '+found+' Products')
                        $('.product-viewall').show();
                        return false;
                    }
                }
            });
            if (count < PRODUCT_MAX_COUNT) {
                $('.product-viewall').hide();
            }
            $('#product_section').html(html);
        }

        /**
         * 
         * @param string keyword 
         */
        function getCategoryAttributes(keyword) {
            let catSearchAttributes = CAT_SEARCHBLE_ATTRIBUTES.map((item) => {
                if (item.search == 1) {
                    return item.code;
                }
            });

            catSearchAttributes = catSearchAttributes.join(',');
            let ranking = null;
            if (CAT_RANKING !== false && CAT_RANKING) {
                ranking = CAT_RANKING;
            }
            let catSearchParameters = {
                'collection': INDEX_PERFIX+STORE+'-categories',
                'q'         : keyword,
                'query_by'  : 'category_name,'+catSearchAttributes,
                'per_page'  : CAT_MAX_COUNT,
                'filter_by' : `store:["${STORE}"]`,
                'sort_by'   : ranking,
                'typo_tokens_threshold' : TYPO_ENABLED,
                'num_typos' : 2,
                'min_len_1typo' : WORD_LENGTH,
                'min_len_2typo' : WORD_LENGTH,
            }
            $.each(catSearchParameters, function (key, val) {
                if (!val) {
                    delete catSearchParameters[key];
                }
            })
            return catSearchParameters;
        }

        /**
         * 
         * @param {*} hits 
         */
        function renderCategory(hits) {
            let html = '';
            if (hits.length < 1) {
                html = 'No Categories found';
            }
            $.each(hits, function (key, val) {
                if (val.document.status == 1) {
                    var path = val.document.path;
                    if (HIGHLIGHTS == 1) {
                        if (typeof val.highlight.path !== 'undefined' && typeof val.highlight.path.snippet !== 'undefined') {
                            var path = path.replace(val.document.path,val.highlight.path.snippet);
                        }
                    }
                    html += `
                        <div>
                            <a href="${val.document.url}">${path}</a>
                        </div>
                    `;
                }
            });
            $('#category_section').html(html);
        }

        /**
         * 
         * @param string keyword 
         */
        function getPageAttributes(keyword) {
            let pageSearchParameters = {
                'collection': INDEX_PERFIX+STORE+'-pages',
                'q'         : keyword,
                'query_by'  : 'page_title',
                'per_page'  : PAGE_MAX_COUNT,
                'filter_by' : `store:["${STORE}"]`,
                'typo_tokens_threshold' : TYPO_ENABLED,
                'num_typos' : 0,
                'min_len_1typo' : WORD_LENGTH,
                'min_len_2typo' : WORD_LENGTH,
            }
            $.each(pageSearchParameters, function (key, val) {
                if (!val) {
                    delete pageSearchParameters[key];
                }
            })
            return pageSearchParameters;
        }
        
        /**
         * 
         * @param {*} hits 
         */
        function renderPages(hits) {
            let html = '';
            if (hits.length < 1) {
                html = 'No Pages found';
            }

            $.each(hits, function (key, val) {
                var title =  val.document.page_title;
                if (HIGHLIGHTS == 1 && typeof(val.highlights[0].field) != "undefined" && val.highlights[0].field == 'page_title') {
                    var title = val.highlight.page_title.snippet;
                }
                if (val.document.status == 1 && $.inArray(val.document.identifier, excludedPageArr) === -1) {
                    html += `
                        <div>
                            <a href="${val.document.url}">${title}</a>
                        </div>
                    `;
                } else {
                    html = 'No Pages found';
                }
            });
            $('#cms_section').html(html);
        }
    }
);
