var parseSlide = function (slideData) {
    var section = $('<section></section>');

    // 设置布局信息和切换动画的信息
    var layout = slideData.layout || 'normal';
    section.attr('data-layout', layout);

    // 生成幻灯片基本结构
    var layoutHtml =
    '<div class="header"></div>' +
    '<div class="content"></div>';
    section.html(layoutHtml);

    var header = section.find('.header');
    var content = section.find('.content');

    // 生成不同元素的html代码
    var titleHtml = TextParser.txt2Html(slideData.content.title || '');
    var subtitleHtml = TextParser.txt2Html(slideData.content.subtitle || '');
    var subtitle2Html = TextParser.txt2Html(slideData.content.subtitle2 || '');
    var contentHtml = TextParser.txt2Html(slideData.content.content || '');
    var content2Html = TextParser.txt2Html(slideData.content.content2 || '');

    if (slideData.content.slide) {
        section.css('background-image', 'url(' + slideData.content.slide + ')');
    }

    titleHtml = '<div data-item="title">' + titleHtml + '</div>';
    subtitleHtml = '<div data-item="subtitle">' + subtitleHtml + '</div>';
    subtitle2Html = '<div data-item="subtitle2">' + subtitle2Html + '</div>';
    contentHtml = '<div data-item="content">' + contentHtml + '</div>';
    content2Html = '<div data-item="content2">' + content2Html + '</div>';

    // 根据不同的布局拼凑不同的html代码
    if (layout == 'double') {
        contentHtml = contentHtml + content2Html;
    }
    if (layout == 'double-subtitle') {
        contentHtml = subtitleHtml + contentHtml + subtitle2Html + content2Html;
    }

    header.html(titleHtml);
    content.html(contentHtml);

    // 设置幻灯片各元素的自定义样式
    if (slideData.style) {
        $.each(slideData.style, function (itemName, styles) {
            var item;
            if (itemName == 'slide') {
                item = section;
            }
            else {
                item = section.find('[data-item="' + itemName + '"]');
            }
            $.each(styles, function (key, value) {
                if (key == '-ppt-size') {
                    if (value && value != 'normal') {
                        item.addClass(value + '-font-size');
                    }
                }
                else {
                    var pValue = parseInt(value);
                    if(pValue){
                        value = ~~(pValue/3)+'px';
                    }
                    item.css(key, value);
                }
            });
        });
    }

    // 设置幻灯片各元素的自定义位置
    if (slideData.position) {
        $.each(slideData.position, function (itemName, styles) {
            var item;
            if (itemName == 'slide') {
                item = section;
            }
            else {
                item = section.find('[data-item="' + itemName + '"]');
            }
            $.each(styles, function (key, value) {
                var pValue = parseInt(value);
                if(pValue){
                    value = ~~(pValue/3)+'px';
                }
                item.css(key, value);
            });
        });
    }
//    return $('<div>').append(section).html();
    return section[0];
}