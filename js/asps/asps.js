/*****************************
 VIEW OPTION - Schedule Statistics
 *****************************/

var selector = document.getElementById("select-option-selector");

if(selector != null) {
    showSelectOption(selector);
}

function showSelectOption(n) {

    var allOptions = document.getElementsByClassName("select-option");
    for (var i = 0; i < allOptions.length; i++){
        allOptions[i].style.display = "none";
    }

    var value = n.options[n.selectedIndex].value;
    var selectedItem = document.getElementById(value);

    selectedItem.style.display = "block";
}




/**********************************************************
                         jQuery
 **********************************************************/

$(document).ready(function() {

    /*****************************
                TABS
     *****************************/

    $('#tabs li a').click(function () {
        makeActive($(this));
    });

    $('#tabs li a').keydown(function(e) {

        if(e.which == 39 || e.which == 40) { //right or down arrow key
            var tab = $('#tabs .active').next();
            if(tab.length == 0) { //if the last tab was selected
                tab = $('#tabs li').first(); //the first tab will get selected
            }
            makeActive(tab.children());
        }

        else if(e.which == 37 || e.which == 38) { //left or up arrow key
            var tab = $('#tabs .active').prev();
            if(!tab.length) { //if the first tab was selected
                tab = $('#tabs li').last(); //the last tab will get selected
            }
            makeActive(tab.children());
        }

        else if (e.which == 32 || e.which == 13) { //space bar or enter
            e.preventDefault();
            var tabContentID = $('#tabs .active a').attr("aria-controls");

            //sets focus to tab content
            $('#' + tabContentID).attr("tabindex", "0");
            $('#' + tabContentID).focus();
            $('#' + tabContentID).attr("tabindex", "-1");

        }

    });

    function makeActive (activeTab) {

        $('#tabs .active a').attr("aria-selected", "false");
        $('#tabs .active a').attr("tabindex", "-1");
        $('#tabs .active').removeClass('active');
        $('.panel-tabs .content-active').removeClass('content-active'); //remove 'active' from the content

        activeTab.focus();
        activeTab.parent().addClass('active');
        activeTab.attr("aria-selected", "true");
        activeTab.attr("tabindex", "0");
        var tabContentID = activeTab.attr("aria-controls"); //gets the content's id
        $('#' + tabContentID).addClass("content-active");  //sets 'active' to the content
    }



    /*****************************
          TOOLTIP - POPOVER
     *****************************/

    $('[data-toggle="popover"]').each(function () {
        var _this = this;

        $(_this).popover({
            trigger: "focus",
            animation: false,
            container: 'body',
            boundary: 'viewport'
        }).on("mouseenter", function () {
            $(_this).popover("show");
        })/*.parent()*/.on("mouseleave", function () {
            $(_this).popover("hide");
        });
    });



    /*****************************
        HIDE ALERT ON PAGE CLICK
     *****************************/

    $(document).click(function () {
        $('.alert-success').hide();
    });


    /*****************************
     MANAGE DESIGNS - DRAFT VS. PRODUCTION
     *****************************/

    $('#btns-promote').on( 'click', 'a', function () {
        var status = $(this).attr("data-status").toString();
        localStorage.setItem("designStatus1", 'draft');
        localStorage.setItem("designStatus2", 'draft');
        localStorage.setItem("designStatus3", 'draft');
        localStorage.setItem("designStatus4", status);
    } );

    setStatus (localStorage.getItem("designStatus1") , 1);
    setStatus (localStorage.getItem("designStatus2") , 2);
    setStatus (localStorage.getItem("designStatus3") , 3);
    setStatus (localStorage.getItem("designStatus4") , 4);

    $('.dropdown').on('click', '.promote-btn', function () {
        promote();
    });

    function promote() {

        var row = $('.dropdown.open').closest('tr');
        var index = row.attr('data-index');
        var storageName = ("designStatus" + index);

        localStorage.setItem(storageName, 'production');
        setStatus(localStorage.getItem(storageName), index);


    }

    function setStatus(status, n) {

        var row = $('#designs tbody tr[data-index="' + n + '"]');

        row.removeClass('draft');
        row.removeClass('production');
        row.addClass(status);

        var text = status.replace(/-/g, " "); //replaces dashes with spaces
        text = text.charAt(0).toUpperCase() + text.slice(1); //sets the first letter to uppercase

        row.find('td:nth-child(2)').html(text);
    }






    /*****************************
               DATA TABLE
     *****************************/

    $('.dataTables_wrapper').on( "wb-ready.wb-tables", function() {
        $(this).find(".top input").addClass('form-control width-auto');
        $(this).find(".top select").addClass('form-control width-auto');
    });

    /*****************************
     DATA TABLE - SELECTABLE ROW
     *****************************/

    $('#designs tbody').on('click focusin', 'tr', function () {
        selectRow($(this));

        if(!$(this).find('.dropdown').hasClass('open')){
            $('.dropdown.open').removeClass('open');
        }

    });

    $('#designs tbody tr').keydown(function (e) {
        var rows = $('#designs .select-option');
        var index = rows.filter('.selected').index();

        if(e.which == 38){ //up
            e.preventDefault();

            if(index <= 0) {
                rows.last().focus();
            }
            else {
                rows.get(parseInt(index) - 1).focus();
            }
        }
        else if(e.which == 40) { //down
            e.preventDefault();

            if(index >= (rows.length - 1)) {
                rows.first().focus();
            }
            else {
                rows.get(parseInt(index) + 1).focus();
            }
        }
    });

    function selectRow(row) {
        $('#designs tbody tr.selected').removeClass('selected');
        row.addClass('selected');
    }

    /*****************************
       DATA TABLE - VIEW OPTION
     *****************************/

    $('#designs').on( "wb-ready.wb-tables", function() {
        displayRows('all'); //displays all the rows to start
    });

    var tableID = "#designs";

    var $selector = $('#select-status-selector');
    $(tableID + ' tbody tr').addClass("select-option"); //adds class to all the table rows

    //when the 'view' value is changed
    $selector.on('change', function() {

        var value = this.value;

        displayRows(value);

        if(value === 'all'){
            if(!$('#designs tbody tr').hasClass('selected')) { //checks if a row is selected
                selectRow($('#designs tbody tr').first()); //if a row is not selected, selects a row
            }
        }
        else {
            if(!$('#designs tbody tr.selected').hasClass(value)){ //checks if selected row is still visible
                selectRow($('#designs tbody tr.' + value).first()); //if the selected row is no longer visible, selects new row
            }
        }

    });

    //function that displays rows based on selection
    function displayRows(value){

        var $allOptions = $(tableID + ' .select-option'); //gets all the rows in the table

        $allOptions.css("display", "none");
        deleteFooter('designs');

        //displays all rows
        if(value === 'all'){
            $allOptions.css("display", "table-row");
        }

        //displays specific rows
        else {
            var $viewRows = $('.select-option.' + value);

            if($viewRows.length > 0) {
                $viewRows.css("display", "table-row");
            }
            else {
                createFooter("designs");
            }
        }
    }

    //function - deletes the tfoot
    function deleteFooter(tableID) {
        document.getElementById(tableID).deleteTFoot();
    }

    //function - creates a tfoot
    function createFooter(tableID) {
        var footer = document.getElementById(tableID).createTFoot();
        footer.innerHTML = '<tfoot><tr style="background-color: #f5f5f5;"><td colspan="6" class="text-center">0 results</td></tr></tfoot>';
    }




    /*****************************
            DROPDOWN TOGGLE
     *****************************/

    $(document).click(function(){
        $('.open').removeClass('open');
    });

    $('.dropdown-toggle').click(function (e) {
        e.stopPropagation();
    });

    $('.dropdown-toggle').click(function () {
        var dropdownContainer = $(this).parent();

        if(dropdownContainer.hasClass('open')){
            dropdownContainer.removeClass('open');
        }
        else {
            $('.dropdown.open').removeClass('open');
            dropdownContainer.addClass('open');
            addActions(dropdownContainer);
        }
    });

    $('.dropdown-toggle').focus(function () {
        var dropdownContainer = $(this).parent();

        if(!dropdownContainer.hasClass('open')){
            $('.dropdown.open').removeClass('open');
        }
    });

    function addActions(dropdownContainer){

        var ul = dropdownContainer.find('.dropdown-menu');

        if(dropdownContainer.parents('tr:first').hasClass('production')){ //if the design's status is 'production'
            ul.empty().append(
                '<li> <a href="#" class="wb-lbx"><span class="fa fa-eye mrgn-rght-10"></span>View output</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx"><i class="fa fa-download mrgn-rght-10"></i></span>Export all output</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx"><span class="fa fa-edit mrgn-rght-10"></span>Update clustering</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx"><span class="fa fa-edit mrgn-rght-10"></span>Update stratification</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx"><span class="fa fa-edit mrgn-rght-10"></span>Update allocation</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx"><span class="fa fa-eye mrgn-rght-10"></span>View schedule</a> </li>'
            )
        }
        else { //if the design's status is 'draft'
            ul.empty().append(
                '<li> <a href="#" class="wb-lbx"><span class="fa fa-eye mrgn-rght-10"></span>View output</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx"><i class="fa fa-download mrgn-rght-10"></i></span>Export all output</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx"><span class="fa fa-edit mrgn-rght-10"></span>Update profile</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx"><span class="fa fa-eye mrgn-rght-10"></span>View Schedule</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx promote-btn"><span class="fa fa-arrow-circle-up mrgn-rght-10"></span>Promote</a> </li>\n' +
                '<li> <a href="#" class="wb-lbx"><span class="fa fa-trash mrgn-rght-10"></span>Delete</a> </li>'
            )
        }
    }



    /*****************************
        DISABLE FIELDS IN A FORM
     *****************************/

    $('form.disable-fields input').prop("disabled", true);




    /*****************************
     PREVENT PAGE JUMP WITH EMPTY LINKS
     *****************************/

    $('a[href="#"]').on('click', function (e) {
       e.preventDefault();
    });

    $('.dropdown').on('click', 'a[href="#"]', function (e) {
        e.preventDefault();
    });



    /*****************************
            LOADING POP UP
     *****************************/


    $('#popup-link').click(function(e) {
        e.preventDefault();

        console.log($(this).attr('data-link'));

        redirectDelay($(this).attr('data-link'));

        $('#progress-bar').focus();
    });

    $('#progress-bar').keydown(function (e) {
        if(e.keyCode == 9){ //if TAB is pressed
            $('#progress-bar').focus(); //keeps focus on TAB key
        }
    });

    function redirectDelay(link) {
        //e.preventDefault();

        updateProgress();

        setTimeout(function() {
            updateProgress(1);
        }, 1000);

        setTimeout(function() {
            window.location.href=link;
        }, 4500);
    }

    function updateProgress(i) {

        var progressBar =  $('.loading-container');
        var width = progressBar.find('.loading-progress').css('width').replace("px", ""); //gets the width
        var maxWidth = progressBar.attr('aria-valuemax');
        var percentage = Math.round(width / maxWidth * 100);

        progressBar.attr('aria-valuetext', "Creating design. " + percentage + "% complete."); //sets the 'valuenow' attribute

        //sets timeout to call the function again in 1 second
        if(i < 4){
            setTimeout(function() {
                updateProgress(++i);
            }, 1000);
        }

    }

} );























