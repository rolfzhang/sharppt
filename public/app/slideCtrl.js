var slideCtrl = {
    
    onCtrl: false,
    slidesRoot: $('#slides'),
    showNoteBtn: $('#showNoteBtn'),
    
    showNoteEl: $('#showNote'),
    noteContentEl: $('#noteContent'),
    
    maskEl: $('#mask'),
    
    exitBtn: $('#exitBtn'),
    
    totalPageEl: $('#totalPage'),
    currentPageEl: $('#currentPage'),
    

    
    slides: [],
    totalPage: 0,
    currentPage: 0,
    
    parseSildes: function(data){
        var that = this;
        this.slidesData = data.slides;
        this.setTotalPage(data.slides.length);
        $.each(data.slides,function(i,slide){
            var slideNode = parseSlide(slide);
                
            slideNode.id = 'slide-'+that.totalPage;
            slideNode.className = 'slide';
            that.slidesRoot.append(slideNode);
                
            that.slides.push(slideNode);
        });
    },
    
    setTotalPage: function(num){
        this.totalPage = num;
        
        this.totalPageEl.html(num);
    },
    getPPTData: function(url,callback){
        //TODO:
        var that = this;
        $.getJSON(url, function(data,state){

            that.parseSildes(data);
            
            callback && callback();
        });
    },
    
    setCurrentPage: function(num){
        num = ~~num;
        
        if(num>=this.totalPage){
            num = this.totalPage - 1;
        }else if(num<0){
            num = 0;
        }

        $(".slide").removeClass('next').removeClass('current').removeClass('prev');
        if(num>this.currentPage){
            $(this.slides[num]).addClass('current');
            $(this.slides[num+1]).addClass('next');
            $(this.slides[this.currentPage]).addClass('prev');
        }else if(num<this.currentPage){
            $(this.slides[num]).addClass('current');
            $(this.slides[num-1]).addClass('prev');
            $(this.slides[this.currentPage]).addClass('next');
        }else{
            $(this.slides[num]).addClass('current');
            $(this.slides[num+1]).addClass('next');
        }
        
        this.currentPage = num;
        this.currentPageEl.html(num+1);
        
    },
    
    nextPage: function(){
        this.setCurrentPage(this.currentPage+1);
    },
    prevPage: function(){
        this.setCurrentPage(this.currentPage-1);
    },
    
    hide: function(){
        this.onCtrl=false;
        this.exitBtn.hide();
        this.slidesRoot.hide();
    },
    show: function(){
        this.onCtrl = true;
        this.exitBtn.show();
        this.slidesRoot.show();
    },
    showNote: function(){
        var slide = this.slidesData[this.currentPage],
        note = slide.note;
        
        if(!note){
            note = '此页无备注内容';
        }
        
        this.showNoteEl.show();
        this.maskEl.show();
        this.noteContentEl.html(note);
        this.exitBtn.hide();
    },
    hideNote: function(){
        this.showNoteEl.hide();
        this.maskEl.hide();
        this.noteContentEl.html('');
        this.exitBtn.show();
    },
    
    
    onGesture: function(type){
        if(!this.onCtrl){
            return;
        }

        if(type=='up'){
            this.nextPage();
        }else if(type=='down'){
            this.prevPage();
        }
    },
    
    init: function(){
        this.onCtrl = true;
        var that = this;
        this.parseSildes(pptData);
        that.setCurrentPage(0);
        
        this.showNoteBtn.bind('click',$.proxy(this.showNote,this));
        this.showNoteEl.bind('click',$.proxy(this.hideNote,this));
        this.maskEl.bind('click',$.proxy(this.hideNote,this));
        
        myEvents.register('pageChange',this.setCurrentPage,this);
        myEvents.register('gesture',this.onGesture,this);
        
    },
    
}

