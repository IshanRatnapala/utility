define([
    'jquery',
    'underscore',
    'Magento_Customer/js/customer-data',
    'modernizr/modernizr',
    'mage/mage'
], function ($, _, customerData) {
    'use strict';

    var version = '0.0.3';
    var mobileBreakpoint = 767;
    var tabletBreakpoint = 1023;
    var breakpointNames = {
        small: 'mobile',
        medium: 'tablet',
        large: 'desktop'
    };
    var mobileMediaQuery = '(max-width: ' + mobileBreakpoint + 'px)';
    var tabletMediaQuery = '(min-width: ' + mobileBreakpoint + 'px) and (max-width: ' + tabletBreakpoint + 'px)';
    var desktopMediaQuery = '(min-width: ' + tabletBreakpoint + 'px)';
    var customer = customerData.get('customer');
    var isMobile = function () {
        return Modernizr.mq(mobileMediaQuery);
    };
    var isTablet = function () {
        return Modernizr.mq(tabletMediaQuery);
    };
    var isDesktop = function () {
        return Modernizr.mq(desktopMediaQuery);
    };
    var getCurrentBreakpoint = function () {
        if (isMobile()) {
            return breakpointNames.small;
        } else if (isTablet()) {
            return breakpointNames.medium;
        } else if (isDesktop()) {
            return breakpointNames.large;
        }
    };
    var isTouch = function () {
        return Modernizr.touch;
    };
    var isUserLoggedIn = function () {
        return _.isString(customer().firstname);
    };

    /* Check if the element is within the container.
     * Optional: check if element IS the container */
    var contains = function (container, element, checkIfSelf) {
        container = container instanceof jQuery ? container[0] : container;
        return (checkIfSelf && $(container).is(element)) || $.contains(container, element);
    };

    /* Stop body scroll (for tablets and mobile) */
    var bodyScroll = {
        savedScrollPos: null,
        savedBodyMargin: null,
        fixedElement: null,
        stop: function (body) {
            this.resume(); /* Resume if already stopped then continue to stopping body scroll */
            this.fixedElement = $(body).length ? $(body) : $('body');
            this.savedScrollPos = $(window).scrollTop();
            this.savedBodyMargin = parseInt(this.fixedElement.css('margin-top'), 10) || 0;
            this.savedWidth = this.fixedElement.css('width');
            this.fixedElement
                .css('position', 'fixed')
                .css('margin-top', '-' + (this.savedBodyMargin + this.savedScrollPos) + 'px', 'important')
                .css('width', '100%')
                .addClass('scrolling-fixed');
        },
        resume: function () {
            if (this.fixedElement && this.fixedElement.length) {
                this.fixedElement
                    .css('position', 'initial')
                    .css('margin-top', this.savedBodyMargin + 'px')
                    .css('width', this.savedWidth)
                    .removeClass('scrolling-fixed');
                $(window).scrollTop(this.savedScrollPos);

                this.fixedElement = null;
                this.savedScrollPos = null;
                this.savedBodyMargin = null;
            }
        }
    };

    /* Scroll to element */
    var scrollPage = function (targetElement, offset, duration) {
        var scrollAmount = 0;
        if (!isNaN(targetElement)) {
            scrollAmount = targetElement;
        } else {
            targetElement = targetElement instanceof jQuery ? targetElement : $(targetElement);
            offset = offset || 0;
            duration = duration || 200;
            scrollAmount = targetElement.offset().top - offset;
        }

        scrollBy(scrollAmount, duration);
    };

    var scrollBy = function (scrollAmount, duration, callback) {
        $('html, body').animate({
            scrollTop: scrollAmount
        }, duration, callback);
    };

    /* Scrolls to given element (jQuery plugin) */
    $.fn.scrollPageTo = function (targetElement, offset, duration) {
        scrollPage(targetElement, offset, duration);
        return this;
    };

    /* Scrolls to selected element (jQuery plugin) */
    $.fn.scrollPageHere = function (offset, duration) {
        scrollPage(this, offset, duration);
        return this;
    };

    /* Trigger an event on breakpoint change */
    var lastBreakpoint;
    $(window).on('resize orientationchange', function() {
        var currentBreakpoint = getCurrentBreakpoint();
        if (currentBreakpoint !== lastBreakpoint) {
            $(window).trigger('breakpoint-change', [currentBreakpoint]);
            lastBreakpoint = currentBreakpoint;
        }
    });
    
    /* Waits for an element to appear on page.
     * @param waitingForElemSelector : must be a selector string.
     * @param callback : callback function.
     * @param all other params will be passed into the callback function.
     * Returns the interval object */
    var waitForAndDo = function (waitingForElemSelector, callback) {
        var args = Array.prototype.slice.call(arguments, 2);
        var interval = setInterval(function () {
            if ($(waitingForElemSelector).length) {
                clearInterval(interval);
                callback.apply(this, args);
            }
        }, 100);
        return interval;
    };

    return {
        version: version,
        mobileBreakpoint: mobileBreakpoint,
        tabletBreakpoint: tabletBreakpoint,
        isMobile: isMobile,
        isTablet: isTablet,
        isDesktop: isDesktop,
        getCurrentBreakpoint: getCurrentBreakpoint,
        isTouch: isTouch,
        isUserLoggedIn: isUserLoggedIn,
        customer: customer,
        contains: contains,
        scrollBy: scrollBy,
        bodyScroll: bodyScroll,
        waitForAndDo: waitForAndDo
    };
});
