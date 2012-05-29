var pageList = {
    rootEl: $('#pageList'),
    containerEl: $('#pageListContainer'),
    
    changePageEl: $('#changePage'),
    
    goBackCtrlBtn: $('#goBackCtrlBtn'),
    slideCtrlBtns: $('#slideCtrlBtns'),

    scroller: null,
    show: function(){
        this.rootEl.show();
        this.scroller.refresh();
        slideCtrl.hide();
        
        this.goBackCtrlBtn.show();
        this.slideCtrlBtns.hide();
    },
    hide: function(){
        this.rootEl.hide();
        slideCtrl.show();
        
        this.goBackCtrlBtn.hide();
        this.slideCtrlBtns.show();
    },
    parsePages: function(data){
        var slides = data.slides,
        that = this;
        $.each(slides, function(i,slide){
            var pageChoose = $('<div class="pageChoose">');
            var pageTitle = $('<div class="pageTitle">').attr('pageNum', i).html(slide.content.title);
            var pageNum = $('<div class="pageNum">').html(i+1);
            pageChoose.append(pageTitle).append(pageNum);
            that.containerEl.append(pageChoose);
        });
    },
    init: function(){
        
        var that = this;
        this.parsePages(pptData);
        this.scroller = new iScroll(this.rootEl[0]);
        this.rootEl.bind('click',$.proxy(this.onPageChoose,this));
        
        this.changePageEl.bind('click',$.proxy(this.show,this));
        
        this.goBackCtrlBtn.bind('click',$.proxy(this.hide,this));
    },
    
    onPageChoose: function(e){
        var target = e.target,
        $target = $(target);
        
        if($target.hasClass('pageTitle')){
            myEvents.trigger('pageChange',[$target.attr('pageNum')]);
            this.hide();
        }
        
    }
}