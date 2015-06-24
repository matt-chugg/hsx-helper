    // might not be necesary, don't know if HSX has jquery should probably check
    var $hj = jQuery.noConflict();


    /*
     * PORTFOLIO PAGE
     */
    function doPortfolioPage() {
        // on portfolio page, make the todays change column clickable to show total instead of per share    
        $hj("#sortable_MovieStocks,#sortable_StarBonds,#sortable_Derivatives,#sortable_MovieFunds").each(function() {
            
            $table = $hj(this);
            
            // skip table it if only had one or none rows
            if($table.find("tbody tr").length < 2) {
                return;
            };
            
            $table.find("tbody tr").each(function() {
                // get number of shares
                $count = parseInt($hj(this).find("td:nth-child(2)").html().replace(/,/g , ""));
                
                // find the span containing today's change
                $today = $hj(this).find("td:nth-child(6) span").first();
                
                // get the change value and update total
                $value = parseFloat($today.html().replace(/H\$/g , ""));
                $total = $count * $value;
                
                //add class to existing span so wqe can see it later
                $today.addClass("today_single");
                
                // add new span to table
                $hj("<span></span>")
                        .html("H$" + commaSeparateNumber($total.toFixed(2)))
                        .addClass($today.attr("class"))
                        .addClass("today_total")
                        .insertBefore($today);
                
            }); // row loop
            
            
        }); // table loop
        
        // bind click event to any value in the todays change colum to switch the value
        $hj(".today_single, today_total").live("click" ,function(){
            $hj(this).closest("table").toggleClass("showtotals");
        });
    }
    
    
    /*
     * League Page
     */

    function doLeaguePage() {
        // check for comment box
        if($hj("textarea[name=comment]").length) {
            // get first span and insert another after it
            $hj("<span></span")
                    .addClass("char_count")
                    .attr("id","char_count")
                    .insertAfter($hj("textarea[name=comment]").parent("td").find("span"));
            
            // add bind
            $hj("textarea[name=comment]").live("input" ,function(){
                // get text length and displauy it
                $len = $hj("textarea[name=comment]").val().length;
                $hj("#char_count").html($len);
                                
                // update color of character count
                if($len > 240) {
                    $hj("#char_count").addClass("close");
                } else {
                    $hj("#char_count").removeClass("close");
                }
                
                if($len>255 ) {
                    $hj("#char_count").addClass("over");
                } else {
                    $hj("#char_count").removeClass("over");
                }
                
                
                
            });
        }
    }

    /*
     * TRADE HISTORY PAGE
     */
    function tradeHistory(isSpecific) {
        $total = 0; $hasFailedTransactions = false;
        // loop through all rows in the table
        $hj("table tbody tr").each(function() {
            // add class to failed transaction rows
            $tr = $hj(this);
            if($tr.find("td").eq(6).html().trim() !== "SUCCESS") {
                $hj(this).addClass("hh_failed-transaction"); $hasFailedTransactions = true;
            } else {
                if(!isSpecific) {
                    // add link to show all of security
                    $cell = $tr.find("td:nth-child(3)");
                    $symbol = $cell.find("a").html();
                    
                    // create the link
                    $l = $hj("<a></a>")
                            .attr("href","http://www.hsx.com/portfolio/history.php?symbol=" + $symbol)
                            .html("&nbsp; >>");
                    
                    // add the link to the cell next to the symbol
                    $cell.append($l);
                } else {
                    // update total
                    $v = parseFloat($tr.find("td:nth-child(6)").attr("sorttable_customkey"));
                    $total = $total + $v;
                }
                
            }
        }); // row loop
        
        
        // set initally table to not show fialed transactions
        $hj("table").addClass("hh_hide-failed-transactions");
        // create toggle button
        $hhToggleTransactionsButton = $hj("<span></span>")
                .addClass("hh_toggle-failed-transactions")
                .html("Toggle failed transactions");
        // add toggle button to page
        $hj(".table_label").append($hhToggleTransactionsButton);
        // add bind to toggle button
        $hj(".hh_toggle-failed-transactions").live("click",function(){
            $hj(this).closest(".whitebox_content").find("table").toggleClass("hh_hide-failed-transactions");
        });
        
        
        
        
        // add total on symbol specific pages.
        if(isSpecific) {
            // create total span with color and symobol
            $t = $hj("<span></span>")
                    .html("H$" + commaSeparateNumber($total.toFixed(2)).replace(/\-/g , ""))
                    .addClass("hh_transaction-total")
                    .addClass($total > 0 ? "up" : "")
                    .addClass($total < 0 ? "down" : "");
            // add total to first h3 in page
            $hj("h3").first().append($t);            
        }
        
    }





    /*
     * Start function
     */
    function DoIt() {
        
        // if portfolio page add daily totals functionality.
        if (window.location.pathname === "/portfolio/") {
            doPortfolioPage();
        }
        
        // trade history page (param to indicate whether its a search)
        if(window.location.pathname === "/portfolio/history.php") {
            tradeHistory(/[?&]symbol=/.test(location.href));
        }
        
        // league page
        if(window.location.pathname === "/league/view.php" && /[?&]id=/.test(location.href)) {
            doLeaguePage();
        }
        
    }





// start the process on load
if(document.body) {DoIt();} else {window.addEventListener("DOMContentLoaded", DoIt, false);}