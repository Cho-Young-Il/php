/* typo graphy */
(function($){

    var uid = 0,
        now = (function(isDateHasNow) {
            return function() {
                if (isDateHasNow) {
                    return Date.now();
                } else {
                    return +(new Date);
                }
            };
        })(!!Date.now);

    function typoShadow(e){
        var $typo = this,
            center = $typo.width() * 0.5,
            radius = e.radius,
            x = (roundMinMax(-radius, radius, e.pageX - $typo.offset().left - center) / radius).toFixed(3) - 0,
            y = Math.sin(Math.acos(x)).toFixed(3) - 0;

        $typo.css('text-shadow', '0 1px 0 #ccc,' +
            '0 2px 0 #c9c9c9,' +
            '0 3px 0 #bbb,' +
            '0 4px 0 #b9b9b9,' +
            '0 5px 0 #aaa,' +
            '0 6px 1px rgba(0,0,0,0.1),' +
            '0 0 5px rgba(0,0,0,0.1),' +
            1 * -x + 'px ' + 1 * y + 'px 3px rgba(0,0,0,0.3),' +
            3 * -x + 'px ' + 3 * y + 'px 5px rgba(0,0,0,0.2),' +
            5 * -x + 'px ' + 5 * y + 'px 10px rgba(0,0,0,0.25),' +
            10 * -x + 'px ' + 10 * y + 'px 10px rgba(0,0,0,0.2),' +
            20 * -x + 'px ' + 20 * y + 'px 20px rgba(0,0,0,0.15)');
    }

    function roundMinMax(min, max, value){
        if(min > value) value = min;
        if(max < value) value = max;
        return value;
    }

    $.fn.typoShadow = function(options){
        var $typos = this;
        options = $.extend(true, {
            radius: 800,
            throttle: 33,
            remove: false
        }, options);

        if (options.remove) {
            $typos.each(function(){
                var $typo = $(this),
                    tid = $typo.data('typoShadowId');
                if (tid) $typo.removeData('typoShadowId').off('mousemove.' + tid).css('text-shadow', '');
            });
        } else {
            $typos.each(function(){
                var $typo = $(this),
                    tid = 'typoShadow' + uid++,
                    timer = now();
                if ($typo.data('typoShadowId')) return uid--;

                $typo
                    .data('typoShadowId', tid)
                    .on('mousemove.' + tid, function(e){
                        var _now = now();
                        if (_now - timer < options.throttle) return;
                        timer = _now;
                        e.radius = options.radius;
                        typoShadow.call($typo, e);
                    });

                typoShadow.call($typo, {pageX: 0, radius: options.radius});
            });
        }

        return $typos;
    };

})(jQuery);

$("#typo").typoShadow();
