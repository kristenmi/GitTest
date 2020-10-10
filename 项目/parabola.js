;
(function () {
    var _$ = function (_this) {
        return _this.constructor == jQuery ? _this : $(_this);
    };

    function now() {
        return +new Date();
    }


    function toInteger(text) {
        text = parseInt(text);
        return isFinite(text) ? text : 0;
    }

    var Parabola = function (options) {
        this.initialize(options);
    };
    Parabola.prototype = {
        constructor: Parabola,
        /**
    
         * @classDescription 
         * @param {Object} options 
         */
        initialize: function (options) {
            this.options = this.options || this.getOptions(options);
            var ops = this.options;
            if (!this.options.el) {
                return;
            }
            this.$el = _$(ops.el);
            this.timerId = null;
            this.elOriginalLeft = toInteger(this.$el.css("left"));
            this.elOriginalTop = toInteger(this.$el.css("top"));

            if (ops.targetEl) {
                this.driftX = toInteger(_$(ops.targetEl).css("left")) - this.elOriginalLeft;
                this.driftY = toInteger(_$(ops.targetEl).css("top")) - this.elOriginalTop;
            } else {
                this.driftX = ops.offset[0];
                this.driftY = ops.offset[1];
            }
            this.duration = ops.duration;
            // 婢跺嫮鎮婇崗顒€绱＄敮鎼佸櫤
            this.curvature = ops.curvature;
          
            this.b = ( this.driftY - this.curvature * this.driftX * this.driftX ) / this.driftX;

            
            if (ops.autostart) {
                this.start();
            }
        },

        getOptions: function (options) {
            if (typeof options !== "object") {
                options = {};
            }
            options = $.extend({}, defaultSetting, _$(options.el).data(), (this.options || {}), options);

            return options;
        },
       
        domove: function (x, y) {

            this.$el.css({
                position: "absolute",
                left: this.elOriginalLeft + x,
                top: this.elOriginalTop + y
            });

            return this;
        },

        step: function (now) {
            var ops = this.options;
            var x, y;
            if (now > this.end) {
                // 鏉╂劘顢戠紒鎾存将
                x = this.driftX;
                y = this.driftY;
                this.domove(x, y);
                this.stop();
                if (typeof ops.callback === 'function') {
                    ops.callback.call(this);
                }
            } else {
                //x 濮ｅ繋绔村銉ф畱X鏉炲娈戞担宥囩枂
                x = this.driftX * ((now - this.begin) / this.duration);
                //濮ｅ繋绔村銉ф畱Y鏉炲娈戞担宥囩枂y = a*x*x + b*x + c;   c==0;
                y = this.curvature * x * x + this.b * x;

                this.domove(x, y);
                if (typeof ops.stepCallback === 'function') {
                    ops.stepCallback.call(this,x,y);
                }
            }
            return this;
        },

        setOptions: function (options) {
            this.reset();
            if (typeof options !== "object") {
                options = {};
            }
            this.options = $.extend(this.options,options);
            this.initialize(this.options);
            return this;
        },

        start: function () {
            var self = this;
            // 鐠佸墽鐤嗙挧閿嬵剾閺冨爼妫�
            this.begin = now();
            this.end = this.begin + this.duration;
            if (this.driftX === 0 && this.driftY === 0) {
                return;
            }
            /*timers.push(this);
             Timer.start();*/
            if (!!this.timerId) {
                clearInterval(this.timerId);
                this.stop();
            }
            this.timerId = setInterval(function () {
                var t = now();
                self.step(t);

            }, 13);
            return this;
        },

        reset: function (x, y) {
            this.stop();
            x = x ? x : 0;
            y = y ? y : 0;
            this.domove(x, y);
            return this;
        },

        stop: function () {
            if (!!this.timerId) {
                clearInterval(this.timerId);

            }
            return this;
        }
    };
    var defaultSetting = {
        el: null,
        //閸嬪繒些娴ｅ秶鐤�
        offset: [0, 0],
        //缂佸牏鍋ｉ崗鍐閿涘矁绻栭弮璺烘皑娴兼俺鍤滈崝銊ㄥ箯閸欐牞顕氶崗鍐閻ㄥ埐eft閵嗕辜op閿涘矁顔曠純顔荤啊鏉╂瑤閲滈崣鍌涙殶閿涘ffset鐏忓棗銇戦弫锟�
        targetEl: null,
        //鏉╂劕濮╅惃鍕闂傝揪绱濇妯款吇500濮ｎ偆顫�
        duration: 500,
        //閹舵稓澧跨痪鎸庢锤閻滃浄绱濈亸杈ㄦЦ瀵垱娲搁惃鍕柤鎼达讣绱濈搾濠冨复鏉╂垳绨�0鐡掑﹤鍎氶惄瀵稿殠閿涘矂绮拋锟�0.001
        curvature: 0.001,
        //鏉╂劕濮╅崥搴㈠⒔鐞涘瞼娈戦崶鐐剁殶閸戣姤鏆�
        callback: null,
        // 閺勵垰鎯侀懛顏勫З瀵偓婵绱濇妯款吇娑撶alse
        autostart: false,
        //鏉╂劕濮╂潻鍥┾柤娑擃厽澧界悰宀€娈戦崶鐐剁殶閸戣姤鏆�
        stepCallback: null
    };
    window.Parabola = Parabola;
})();