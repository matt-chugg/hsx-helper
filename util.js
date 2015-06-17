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