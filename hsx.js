            var $hj = jQuery.noConflict();

    // utility function to add commas in to numbers
    function commaSeparateNumber(val){
        val = val.toString().replace(/,/g, ''); //remove existing commas first
        var valSplit = val.split('.'); //then separate decimals

        while (/(\d+)(\d{3})/.test(valSplit[0].toString())){
            valSplit[0] = valSplit[0].toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }

        if(valSplit.length === 2){ //if there were decimals
            val = valSplit[0] + "." + valSplit[1]; //add decimals back
        }else{
            val = valSplit[0]; }
        return val;
    }


    /*
     * PORT FOLIO PAGE
     */
    function doPortfolioPage() {
        // on portfolio page, make the todays change column clickable to show total instead of per share    
        $hj("#sortable_MovieStocks,#sortable_StarBonds,#sortable_Derivatives,#sortable_MovieFunds").each(function() {
            
            $table = $hj(this);
            
            $table.find("tbody tr").each(function() {
                // get number of shares
                $count = parseInt($hj(this).find("td:nth-child(2)").html().replace(/,/g , ""));
                
                // find the span containing today's change
                $today = $hj(this).find("td:nth-child(6) span").first();
                
                // get the change value
                $value = parseFloat($today.html().replace(/H\$/g , ""));
                
                // get total change
                $total = $count * $value;
                
                //add class to existing span so wqe can see it later
                $today.addClass("today_single");
                
                // add new span to table
                jQuery("<span></span>")
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
                    .insertAfter(jQuery("textarea[name=comment]").parent("td").find("span"));
            
            // add bind
            $hj("textarea[name=comment]").live("input" ,function(){
                // get text lendy and displauy it
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
        $hj("table tbody tr").each(function() {
            // remove rows that are unsuccessfull
            if($hj(this).find("td").eq(6).html().trim() !== "SUCCESS") {
                $hj(this).remove();
            } else if(!isSpecific) {
                // add link to show all of security
                $cell = jQuery(this).find("td:nth-child(3)");
                $symbol = $cell.find("a").html();
                $cell.html($cell.html() + "&nbsp;|&nbsp;<a href=\"http://www.hsx.com/portfolio/history.php?symbol=" + $symbol + "\">&gt;<a/>");
            }
        }); // row loop
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
        
        if(window.location.pathname === "/league/view.php" && /[?&]id=/.test(location.href)) {
            doLeaguePage();
        }
        
    }





// start the process on load
if(document.body) {DoIt();} else {window.addEventListener("DOMContentLoaded", DoIt, false);}