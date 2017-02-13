  var ua = window.navigator.userAgent.toLowerCase();
    window.platform = {
        isHD: window.devicePixelRatio > 1,
        isiPad: ua.match(/ipad/i) !== null,
        isNexus7: ua.match(/Nexus 7/gi) !== null,
        isMobile: ua.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile/i) !== null && ua.match(/Mobile/i) !== null,
        isiPhone: ua.match(/iphone/i) !== null,
        isAndroid: ua.match(/android/i) !== null,
        isS3: ua.match(/gt\-i9300/i) !== null,
        isS4: ua.match(/(gt\-i95)|(sph\-l720)/i) !== null,
        isS5: ua.match(/sm\-g900/i) !== null,
        isS6: ua.match(/sm\-g9250/i) !== null,
        isS7: ua.match(/sm\-g930p/i) !== null,
        isTab4: ua.match(/sm\-t530/i) !== null,
        isIE: /(msie|trident)/i.test(navigator.userAgent),
        ltIE9: $('html').hasClass('lt-ie9'),
        isIE9: $('html').hasClass('ie9'),
        isIE11: ua.match(/Trident\/7\.0/i) !== null,
        isChrome: ua.match(/Chrome/gi) !== null,
        isFirefox: ua.match(/firefox/gi) !== null,
        hasTouch: ('ontouchstart' in window),
        supportsSvg: !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    };

    window.platform.isAndroidPad = platform.isAndroid && !platform.isMobile;
    window.platform.isTablet = platform.isiPad || platform.isAndroidPad;
    window.platform.isDesktop = !(platform.isMobile || platform.isTablet);
    window.platform.isIOS = platform.isiPad || platform.isiPhone;
    window.platform.isIE10 = platform.isIE && !platform.isIE9 && !platform.isIE11;

    if (platform.isHD) $html.addClass('hd');
    if (platform.isiPad) $html.addClass('ipad');
    if (platform.isNexus7) $html.addClass('nexus7');
    if (platform.isMobile) $html.addClass('mobile');
    if (platform.isiPhone) $html.addClass('iphone');
    if (platform.isAndroid) $html.addClass('android');
    if (platform.isS3) $html.addClass('s3');
    if (platform.isS4) $html.addClass('s4');
    if (platform.isS5) $html.addClass('s5');
    if (platform.isS6) $html.addClass('s6');
    if (platform.isS7) $html.addClass('s7');
    if (platform.isTab4) $html.addClass('tab4');
    if (platform.isIE) $html.addClass('ie');
    if (platform.isIE10) $html.addClass('ie10');
    if (platform.isIE11) $html.addClass('ie11');
    if (platform.isChrome) $html.addClass('chrome');
    if (platform.isFirefox) $html.addClass('firefox');
    if (platform.hasTouch) $html.addClass('has-touch');
    if (!platform.hasTouch) $html.addClass('no-touch');
    if (platform.supportsSvg) $html.addClass('support-svg');
    if (platform.isAndroidPad) $html.addClass('android-pad');
    if (platform.isTablet) $html.addClass('tablet');
    if (platform.isDesktop) $html.addClass('desktop');
    if (platform.isIOS) $html.addClass('ios');
    setTimeout(function(){
        var w = $window.width();
        window.platform.isiPhone6p = platform.isiPhone && (w == 414 || w == 736);
        window.platform.isiPhone6 = platform.isiPhone && (w == 375 || w == 667);
        window.platform.isiPhone5 = platform.isiPhone && (w == 320 || w == 568);

        if(platform.isiPhone6p) $html.addClass('iphone6p');
        if(platform.isiPhone6) $html.addClass('iphone6');
        if(platform.isiPhone5) $html.addClass('iphone5');
    }, 1000);