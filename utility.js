define([
    'jquery',
    'underscore',
    'Magento_Customer/js/customer-data',
    'modernizr/modernizr',
    'mage/mage'
], function ($, _, customerData) {
    'use strict';

    var version = '0.2';

    var SITE_OPTIONS = {
        MOBILE_BREAKPOINT: 767,
        TABLET_BREAKPOINT: 1023
    };
    var breakpointNames = {
        small: 'mobile',
        medium: 'tablet',
        large: 'desktop'
    };
    var mediaQuery = {
        mobileMediaQuery: '(max-width: ' + SITE_OPTIONS.MOBILE_BREAKPOINT + 'px)',
        tabletMediaQuery: '(min-width: ' + SITE_OPTIONS.MOBILE_BREAKPOINT + 'px) and (max-width: ' + SITE_OPTIONS.TABLET_BREAKPOINT + 'px)',
        desktopMediaQuery: '(min-width: ' + SITE_OPTIONS.TABLET_BREAKPOINT + 'px)'
    };
    var customer = customerData.get('customer');
    var isMobile = function () {
        return Modernizr.mq(mediaQuery.mobileMediaQuery);
    };
    var isTablet = function () {
        return Modernizr.mq(mediaQuery.tabletMediaQuery);
    };
    var isDesktop = function () {
        return Modernizr.mq(mediaQuery.desktopMediaQuery);
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

    return {
        version: version,
        mobileBreakpoint: SITE_OPTIONS.MOBILE_BREAKPOINT,
        tabletBreakpoint: SITE_OPTIONS.TABLET_BREAKPOINT,
        isMobile: isMobile,
        isTablet: isTablet,
        isDesktop: isDesktop,
        getCurrentBreakpoint: getCurrentBreakpoint,
        isTouch: isTouch,
        isUserLoggedIn: isUserLoggedIn,
        customer: customer,
        contains: contains,
        scrollBy: scrollBy
    };
});
