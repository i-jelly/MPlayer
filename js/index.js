(function() {

    var bodyEl = document.body,
        content = document.querySelector('.content-wrap'),
        openbtn = document.getElementById('open-button'),
        closebtn = document.getElementById('close-button'),
        isOpen = false;

    function init() {
        initEvents();
    }

    function initEvents() {
        openbtn.addEventListener('click', toggleMenu);
        if (closebtn) {
            closebtn.addEventListener('click', toggleMenu);
        }

        // close the menu element if the target it´s not the menu element or one of its descendants..
        content.addEventListener('click', function(ev) {
            var target = ev.target;
            if (isOpen && target !== openbtn) {
                toggleMenu();
            }
        });
    }

    function toggleMenu() {
        if (isOpen) {
            classie.remove(bodyEl, 'show-menu');
        } else {
            classie.add(bodyEl, 'show-menu');
        }
        isOpen = !isOpen;
    }

    init();

})();

(function($, window, document, undefined) {
    var pluginName = "jqueryAccordionMenu";
    var defaults = {
        speed: 300,
        showDelay: 0,
        hideDelay: 0,
        singleOpen: true,
        clickEffect: true
    };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({},
            defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init()
    };
    $.extend(Plugin.prototype, {
        init: function() {
            this.openSubmenu();
            this.submenuIndicators();
            if (defaults.clickEffect) {
                this.addClickEffect()
            }
        },
        openSubmenu: function() {
            $(this.element).children("ul").find("li").bind("click touchstart",
                function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if ($(this).children(".submenu").length > 0) {
                        if ($(this).children(".submenu").css("display") == "none") {
                            $(this).children(".submenu").delay(defaults.showDelay).slideDown(defaults.speed);
                            $(this).children(".submenu").siblings("a").addClass("submenu-indicator-minus");
                            if (defaults.singleOpen) {
                                $(this).siblings().children(".submenu").slideUp(defaults.speed);
                                $(this).siblings().children(".submenu").siblings("a").removeClass("submenu-indicator-minus")
                            }
                            return false
                        } else {
                            $(this).children(".submenu").delay(defaults.hideDelay).slideUp(defaults.speed)
                        }
                        if ($(this).children(".submenu").siblings("a").hasClass("submenu-indicator-minus")) {
                            $(this).children(".submenu").siblings("a").removeClass("submenu-indicator-minus")
                        }
                    }
                    window.location.href = $(this).children("a").attr("href")
                })
        },
        submenuIndicators: function() {
            if ($(this.element).find(".submenu").length > 0) {
                $(this.element).find(".submenu").siblings("a").append("<span class='submenu-indicator'>+</span>")
            }
        },
        addClickEffect: function() {
            var ink, d, x, y;
            $(this.element).find("a").bind("click touchstart",
                function(e) {
                    $(".ink").remove();
                    if ($(this).children(".ink").length === 0) {
                        $(this).prepend("<span class='ink'></span>")
                    }
                    ink = $(this).find(".ink");
                    ink.removeClass("animate-ink");
                    if (!ink.height() && !ink.width()) {
                        d = Math.max($(this).outerWidth(), $(this).outerHeight());
                        ink.css({
                            height: d,
                            width: d
                        })
                    }
                    x = e.pageX - $(this).offset().left - ink.width() / 2;
                    y = e.pageY - $(this).offset().top - ink.height() / 2;
                    ink.css({
                        top: y + 'px',
                        left: x + 'px'
                    }).addClass("animate-ink")
                })
        }
    });
    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options))
            }
        });
        return this
    }
})(jQuery, window, document);

;(function($) {
    $.expr[":"].Contains = function(a, i, m) {
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };

    function filterList(header, list) {
        //@header 头部元素
        //@list 无需列表
        //创建一个搜素表单
        var form = $("<form>").attr({
                "class": "filterform",
                action: "#"
            }),
            input = $("<input>").attr({
                "class": "filterinput",
                type: "text"
            });
        $(form).append(input).appendTo(header);
        $(input).change(function() {
            var filter = $(this).val();
            if (filter) {
                $matches = $(list).find("a:Contains(" + filter + ")").parent();
                $("li", list).not($matches).slideUp();
                $matches.slideDown();
            } else {
                $(list).find("li").slideDown();
            }
            return false;
        }).keyup(function() {
            $(this).change();
        });
    }
    $(function() {
        filterList($("#form"), $("#demo-list"));
    });
})(jQuery);

//顶部导航切换
$("#demo-list li").click(function() {
    $("#demo-list li.active").removeClass("active");
    $(this).addClass("active");
});
$("#jquery-accordion-menu").jqueryAccordionMenu();