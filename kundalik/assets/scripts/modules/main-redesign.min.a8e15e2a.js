define("common/dnevnik", [], function() {
    "use strict";
    var a = window.dnevnik || {};
    a.namespace = function(e) {
        var t = a,
            n = e.split("."),
            i, s;
        if (n[0] === "dnevnik") {
            n = n.slice(1)
        }
        for (i = 0, s = n.length; i < s; i += 1) {
            if (typeof t[n[i]] === "undefined") {
                t[n[i]] = {}
            }
            t = t[n[i]]
        }
        return t
    };
    window.dnevnik = a;
    window.yandex_metrika_callbacks = window.yandex_metrika_callbacks || [];
    return a
});
define("common/pubsub", [], function() {
    "use strict";
    var e = dnevnik.pubsub = {};
    e.subscribers = {};
    e.subscribe = function(e, t) {
        if (!this.subscribers[e]) {
            this.subscribers[e] = []
        }
        this.subscribers[e].push(t)
    };
    e.publish = function(e, t) {
        var n = this.subscribers[e],
            i, s;
        if (!n) {
            return
        }
        for (i = 0, s = n.length; i < s; i += 1) {
            n[i](t)
        }
    }
});
define("async/polling", ["common/dnevnik"], function() {
    "use strict";

    function e() {
        var n = 1e3;
        var i = 0;
        var e = 1;
        var t = 2;
        var s = 3;
        var a = 4;
        var o = 5;
        var l;
        var r;
        var c;
        var d = function(e) {
            var t = e.taskStatus;
            if (t === s) {
                if (r && l.success) {
                    l.success()
                }
                r = false
            }
            if (t === a || t === i || t === o) {
                r = false;
                if (l.error) {
                    l.error(e)
                }
            }
            if (r) {
                setTimeout(function() {
                    g(l)
                }, n)
            }
        };
        var u = function(e, t) {
            if (t && e && t.status === 403) {
                window.location.replace(e)
            } else if (l.error) {
                l.error(t)
            }
        };
        var g = function(t) {
            $.ajax({
                type: "GET",
                url: t.taskStateHandlerUrl,
                dataType: "json",
                async: t.async === undefined ? true : t.async,
                data: {
                    a: "gts",
                    tid: t.taskID
                }
            }).done(t.requestCompleted ? t.requestCompleted : d).fail(function(e) {
                u(t.loginUrl, e)
            })
        };
        var h = function(e) {
            l = e;
            c = l.taskID;
            r = true;
            g(e)
        };
        var f = function() {
            r = false;
            c = undefined
        };
        var m = function() {
            return c
        };
        var y = function() {
            return r
        };
        return {
            start: h,
            cancel: f,
            status: {
                TASK_STATUS_UNDEFINED: i,
                TASK_STATUS_PENDING: e,
                TASK_STATUS_EXECUTING: t,
                TASK_STATUS_COMPLETED: s,
                TASK_STATUS_ERROR: a
            },
            getTaskId: m,
            isPolling: y,
            request: g
        }
    }
    var t = e();
    t.ctor = e;
    return t
});
define("controls/utils", ["common/dnevnik"], function() {
    "use strict";
    dnevnik.namespace("dnevnik.common.controls");
    dnevnik.common.controls.Dictionaries = {
        BuildList: function(e) {
            var t, n = ['<option value="" >-  ' + e.label + "  -</option>"];
            for (t = 0; t < e.list.length; t += 1) {
                n.push('<option value="' + e.list[t].Id + '" data-type="' + e.list[t].Type + '">' + e.list[t].Name + "</option>")
            }
            return n.join("")
        }
    }
});
define("controls/cityselectbox", ["common/dnevnik", "controls/utils"], function() {
    "use strict";
    dnevnik.namespace("dnevnik.common.controls");
    dnevnik.common.controls.ChainedSelectInput = function(e) {
        this.o = $.extend({}, this.defaults, e);
        this.init()
    };
    dnevnik.common.controls.ChainedSelectInput.prototype = {
        defaults: {
            el: null,
            next: null,
            change: null,
            label: "Загрузка...",
            ajaxUrl: null
        },
        init: function() {
            this._onChange = $.proxy(this.onChange, this);
            this._clear = $.proxy(this.clear, this);
            this._onParantChanged = $.proxy(this.onParantChanged, this);
            this._LoadList = $.proxy(this.LoadList, this);
            this.el = $(this.o.el + "_Select");
            this.next = $(this.o.next + "_Select");
            this.hidden = $(this.o.el);
            this.el.bind("change", this._onChange);
            this.el.bind("csi:parantchanged", this._onParantChanged);
            this.el.bind("csi:clear", this._clear)
        },
        onChange: function(e) {
            this.hidden.val(this.el.val());
            var t = true;
            if (this.o.change) {
                t = this.o.change(e, this)
            }
            if (t) {
                this.next.trigger("csi:parantchanged", this.el.val())
            }
        },
        onParantChanged: function(e, t) {
            if (t) {
                this.LoadList(t, null);
                if (this.next) {
                    this.next.trigger("csi:clear")
                }
            } else {
                this.clear()
            }
        },
        LoadList: function(e, n, i) {
            this.el.empty().attr("disabled", "disabled").append('<option value="">' + this.o.label + "</option>").parent().show();
            var s = this;
            $.post(this.o.ajaxUrl, {
                id: e
            }, function(e) {
                s.el.html(dnevnik.common.controls.Dictionaries.BuildList(e)).removeAttr("disabled");
                if (n) {
                    var t = i ? 'option[value= "' + n + '"][data-type="' + i + '"]' : 'option[value= "' + n + '"]';
                    s.el.find(t).attr("selected", true);
                    s.hidden.val(n)
                }
            }, "json")
        },
        clear: function() {
            this.hidden.val(null);
            this.el.empty().parent().hide();
            if (this.next) {
                this.next.trigger("csi:clear")
            }
        }
    };
    dnevnik.common.controls.CitySelectBox = function(e) {
        this.o = $.extend({}, this.defaults, e);
        this.init(this.o)
    };
    dnevnik.common.controls.CitySelectBox.prototype = {
        defaults: {
            ajaxUrl: null,
            baseElId: "CitySelectBox",
            label: "Загрузка...",
            useCityRegion: false
        },
        init: function(i) {
            this.cityRegion = i.useCityRegion && new dnevnik.common.controls.ChainedSelectInput({
                el: "#" + i.baseElId + "_CityRegionId",
                ajaxUrl: i.ajaxUrl + "/cityregionlist"
            });
            this.city = new dnevnik.common.controls.ChainedSelectInput({
                el: "#" + i.baseElId + "_CityId",
                next: i.useCityRegion ? "#" + i.baseElId + "_CityRegionId" : null,
                ajaxUrl: i.ajaxUrl + "/citylist"
            });
            var s = this;
            this.childRegion = new dnevnik.common.controls.ChainedSelectInput({
                el: "#" + i.baseElId + "_ChildRegionId",
                next: "#" + i.baseElId + "_CityId",
                ajaxUrl: i.ajaxUrl + "/cityandregionlist",
                change: function(e, t) {
                    var n = t.el.val();
                    t.hidden.val(n);
                    if (n && t.el.find(":selected").data("type") === "city") {
                        t.next.trigger("csi:clear");
                        t.hidden.val(null);
                        s.city.hidden.val(n);
                        if (i.useCityRegion) {
                            s.cityRegion.el.trigger("csi:parantchanged", n)
                        }
                        return false
                    }
                    return true
                }
            });
            this.region = new dnevnik.common.controls.ChainedSelectInput({
                el: "#" + i.baseElId + "_RegionId",
                next: "#" + i.baseElId + "_ChildRegionId",
                ajaxUrl: i.ajaxUrl + "/regionlist"
            });
            this.country = new dnevnik.common.controls.ChainedSelectInput({
                el: "#" + i.baseElId + "_CountryId",
                next: "#" + i.baseElId + "_RegionId",
                ajaxUrl: i.ajaxUrl + "/countrylist"
            })
        },
        select: function(e) {
            if (e.Visible === false) {
                return
            }
            this.country.LoadList(null, e.CountryId);
            if (e.RegionId) {
                this.region.LoadList(e.CountryId, e.RegionId)
            }
            if (e.ChildRegionId) {
                this.childRegion.LoadList(e.RegionId, e.ChildRegionId, "region")
            }
            if (e.CityId) {
                if (e.ChildRegionId) {
                    this.city.LoadList(e.ChildRegionId, e.CityId)
                } else {
                    this.city.LoadList(e.RegionId, e.CityId, "city")
                }
            }
            if (this.o.useCityRegion && e.CityRegionId) {
                this.cityRegion.LoadList(e.CityId, e.CityRegionId)
            }
        },
        values: function() {
            var e = {};
            e[this.country.hidden.attr("name")] = this.country.hidden.val();
            e[this.region.hidden.attr("name")] = this.region.hidden.val();
            e[this.childRegion.hidden.attr("name")] = this.childRegion.hidden.val();
            e[this.city.hidden.attr("name")] = this.city.hidden.val();
            if (this.o.useCityRegion) {
                e[this.cityRegion.hidden.attr("name")] = this.cityRegion.hidden.val()
            }
            return e
        }
    }
});
define("controls/datetimebox", ["common/dnevnik"], function() {
    "use strict";
    dnevnik.namespace("dnevnik.common.controls");
    dnevnik.common.controls.DateTimeBox = function(e, t, n) {
        var i = {
            months: $.d.calendar.localization.lang.months,
            months_short: $.d.calendar.localization.lang.shortMonths,
            isHebrew: $.d.calendar.localization.lang.isHebrew,
            isArabic: $.d.calendar.localization.lang.isArabic,
            weekdays_short: $.d.calendar.localization.lang.weekdays_short,
            todayLabel: $.d.calendar.localization.lang.todayLabel
        };
        if (t.TodayDate) {
            i.todayDate = t.TodayDate
        }
        if (t.FromDate) {
            i.fromDate = t.FromDate
        }
        if (t.ToDate) {
            i.toDate = t.ToDate
        }
        if (t.StartScreen) {
            i.startScreen = t.StartScreen
        }
        if (t.Mode === "ButtonWithRedirect") {
            var s = t.UrlForButtonWithRedirect.indexOf("?") < 0 ? t.UrlForButtonWithRedirect + "?var" : t.UrlForButtonWithRedirect;
            i.onDateSelected = function(e) {
                window.location.href = s + "&year=" + e.year + "&month=" + e.month + "&day=" + e.day
            }
        } else {
            i.onDateSelected = n ? n : function() {
                return false
            }
        }
        $("#" + e).calendar(i);
        if (t.Mode === "ButtonWithRedirect") {
            $("#" + e + "_button").click(function() {
                $("#" + e).click()
            })
        }
    }
});
define("controls/captcha", ["common/dnevnik"], function() {
    "use strict";
    return function(s) {
        var e = document,
            a = e.getElementById(s.id),
            t = a.getElementsByClassName(s.refreshButton)[0];

        function n() {
            var e = o(),
                t = a.getElementsByClassName(s.valueField)[0],
                n = a.getElementsByClassName(s.inputField)[0],
                i = a.getElementsByClassName(s.imageChild)[0];
            n.value = "";
            t.value = e;
            setTimeout(function() {
                i.src = s.imagePart + e
            }, 100)
        }

        function o() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
                var t = Math.random() * 16 | 0,
                    n = e === "x" ? t : t & 3 | 8;
                return n.toString(16)
            })
        }
        n();
        t.addEventListener("click", function() {
            n()
        }, false)
    }
});
define("controls/input_phone", [], function() {
    "use strict";
    return function(e) {
        var t = e.id,
            n = document,
            s = n.getElementById(t),
            i = "+7 ( <%= this[0] %><%= this[1] %><%= this[2] %> ) <%= this[3] %><%= this[4] %><%= this[5] %><%= this[6] %><%= this[7] %><%= this[8] %><%= this[9] %>",
            a = e.template || i,
            o = a.indexOf("<%= this[0] %>"),
            l = e.phoneLength || 10;
        a = _.template(a);

        function r() {
            return s.value.substring(o, s.selectionStart).replace(/\D/g, "").length
        }

        function c(e) {
            return e.substring(o)
        }

        function d(e, t) {
            var n = Array.from(c(e).matchAll(/[\d]/g)).map(function(e) {
                return e.index
            });
            if (s.selectionEnd <= o || n.length === 0) {
                return o
            }
            var i = n[t - 1];
            return i + 1 + o
        }

        function u(e) {
            s.setSelectionRange(e, e)
        }

        function g(e) {
            var t = r();
            var n = d(e.target.value, t);
            u(n)
        }

        function h(e) {
            e = e || l;
            return new Array(e).join(" ")
        }
        if (s.value.length > l) {
            s.setAttribute("value", a.call(s.value.substring(s.value.length - l)))
        } else {
            s.setAttribute("value", a.call(h()))
        }

        function f() {
            var e = c(s.value).replace(/\D/g, "");
            var t = r();
            var n, i;
            if (e.length > l) {
                n = a.call(e.substring(0, l))
            } else {
                n = a.call(e.concat(h(l - e.length)))
            }
            if (t > l) {
                i = n.length
            } else {
                i = d(n, t)
            }
            s.value = n;
            u(i)
        }
        s.addEventListener("focus", g);
        s.addEventListener("click", g);
        s.addEventListener("keydown", g);
        s.addEventListener("input", f)
    }
});
define("controls/dictionaries", [], function() {
    "use strict";
    return function(e) {
        var t = document,
            n = e.ajaxUrl,
            i = e.errorText,
            s = t.getElementById("outype"),
            a = t.getElementById("ouclass"),
            o = t.getElementById("eduOrgclass"),
            l, r;
        l = function() {
            r()
        };
        r = function() {
            var e = s.value;
            var t = dnevnik.dialogs;
            $.ajax({
                type: "Post",
                url: n,
                dataType: "json",
                data: {
                    a: "eoclass",
                    eotid: e
                },
                success: function(e) {
                    if (!e.isOrgTypeNew) {
                        o.classList.remove("orgclass_hidden")
                    } else {
                        o.classList.add("orgclass_hidden")
                    }
                    a.innerHTML = e.list
                },
                error: function() {
                    t.error(i)
                }
            })
        };
        s.addEventListener("change", l)
    }
});
define("controls/controls", ["controls/utils", "controls/cityselectbox", "controls/datetimebox", "controls/captcha", "controls/input_phone", "controls/dictionaries"], function() {
    "use strict"
});
define("analytics/service", ["common/dnevnik"], function() {
    "use strict";
    var n = arguments[0];
    return function e() {
        var t = arguments[0];
        (function(e, t, n, i, s, a, o) {
            e["GoogleAnalyticsObject"] = s;
            e[s] = e[s] || function() {
                (e[s].q = e[s].q || []).push(arguments)
            }, e[s].l = 1 * new Date;
            a = t.createElement(n), o = t.getElementsByTagName(n)[0];
            a.async = 1;
            a.src = i;
            o.parentNode.insertBefore(a, o)
        })(window, document, "script", t, "_ga");
        this.settings = n.settings;
        this.urls = n.urls;
        this.user = n.user
    }
});
define("analytics/googletracker", [], function() {
    "use strict";

    function a(e, t, n) {
        var i = window._ga;
        var s = n !== undefined ? n + "." : "";
        i(s + "set", "dimension1", e.sex);
        i(s + "set", "dimension2", e.age.toString());
        i(s + "set", "dimension3", e.role);
        if (t) {
            i(s + "set", "dimension4", t.id.toString())
        } else {
            i(s + "set", "dimension4", "-1")
        }
        if (e.children) {
            var a = e.children[0];
            if (a) {
                i(s + "set", "dimension5", a.age.toString());
                if (a.sex === "Male") {
                    i(s + "set", "dimension8", "Boy")
                } else {
                    i(s + "set", "dimension8", "Girl")
                }
            }
        }
        if (typeof useAdBlock === "undefined") {
            i(s + "set", "dimension6", "Use")
        } else {
            i(s + "set", "dimension6", "NotUse")
        }
        i(s + "set", "dimension7", e.id.toString());
        if (t) {
            i(s + "set", "dimension9", t.regionName)
        } else {
            i(s + "set", "dimension9", "-1")
        }
        i(s + "set", "dimension11", e.experimentPRTopic)
    }

    function i(e, t) {
        var n = document.location;
        var i = n.host.split(".")[0];
        return e.some(function(e) {
            return i === e
        }) || t.some(function(e) {
            return n.pathname.indexOf(e) > -1
        })
    }
    return function e(t) {
        var n = {
            googleAnalyticsId: t.googleAnalyticsId,
            isDefault: t.isDefault,
            isAddition: t.isAddition,
            hosts: t.hosts === undefined ? [] : t.hosts,
            urls: t.urls === undefined ? [] : t.urls,
            name: t.name,
            isAppropriate: i(t.hosts === undefined ? [] : t.hosts, t.urls === undefined ? [] : t.urls),
            sampleRate: t.sampleRate === undefined ? 100 : t.sampleRate,
            track: function(e, t, n) {
                if (this.name !== undefined) {
                    e("create", this.googleAnalyticsId, "auto", this.name, t ? {
                        userId: t.id.toString(),
                        sampleRate: this.sampleRate
                    } : {
                        sampleRate: this.sampleRate
                    })
                } else {
                    e("create", this.googleAnalyticsId, "auto", t ? {
                        userId: t.id.toString(),
                        sampleRate: this.sampleRate
                    } : {
                        sampleRate: this.sampleRate
                    })
                }
                var i = this.name !== undefined ? this.name + ".require" : "require";
                e(i, "displayfeatures");
                e(i, "ec");
                if (t) {
                    a(t, n, this.name)
                }
                var s = this.name !== undefined ? this.name + ".send" : "send";
                e(s, "pageview")
            }
        };
        return n
    }
});
define("analytics/google", ["analytics/service", "analytics/googletracker"], function() {
    "use strict";
    var e = arguments[0],
        c = arguments[1],
        t;
    t = new e("//www.google-analytics.com/analytics.js");
    t.init = function() {
        var e = [new c({
            googleAnalyticsId: this.settings.googleAnalytics.defaultId,
            isDefault: true,
            isAddition: false
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.appsId,
            isDefault: false,
            isAddition: false,
            hosts: ["apps"],
            urls: ["/subscriptions"],
            name: "apps"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.appSubscriptionId,
            isDefault: false,
            isAddition: false,
            urls: ["/subscriptions"]
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.adId,
            isAddition: true,
            hosts: ["ad"],
            name: "ad"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.childrenId,
            isAddition: true,
            hosts: ["children"],
            name: "children"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.contactId,
            isAddition: true,
            hosts: ["contact"],
            name: "contact"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.eventsId,
            isAddition: true,
            hosts: ["events"],
            name: "events"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.groupsId,
            isAddition: true,
            hosts: ["groups"],
            name: "groups"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.loginId,
            isAddition: true,
            hosts: ["login"],
            name: "login"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.messengerId,
            isAddition: true,
            hosts: ["messenger"],
            name: "messenger"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.networksId,
            isAddition: true,
            hosts: ["networks"],
            name: "networks"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.peopleId,
            isAddition: true,
            hosts: ["people"],
            name: "people"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.schoolsId,
            isAddition: true,
            hosts: ["schools"],
            name: "schools"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.wikiId,
            isAddition: true,
            hosts: ["wiki"],
            name: "wiki"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.appsId,
            isDefault: false,
            isAddition: false,
            hosts: ["tests"],
            name: "tests"
        }), new c({
            googleAnalyticsId: this.settings.googleAnalytics.appsId,
            isDefault: false,
            isAddition: false,
            hosts: ["lib"],
            name: "lib"
        })];
        var t = false;
        e.sort(function(e, t) {
            return e.isDefault < t.isDefault ? -1 : 1
        });
        var n = window._ga;
        var i = this.user;
        var s = null;
        var a = null;
        if (i) {
            s = i.schools && i.schools[0] ? i.schools[0] : null;
            a = i.subscriptionPaymentType
        }
        var o = false;
        e.forEach(function(e) {
            if (e.isAddition) {
                if (e.isAppropriate) {
                    e.track(n, i, s, a);
                    o = true
                }
            } else {
                if (!e.isDefault && e.isAppropriate) {
                    e.track(n, i, s, a);
                    t = true
                }
                if (e.isDefault && t === false) {
                    e.track(n, i, s, a);
                    t = true
                }
            }
        });
        if (!o) {
            var l = new c({
                googleAnalyticsId: this.settings.googleAnalytics.mainId,
                name: "main"
            });
            l.track(n, i, s, a)
        }
        var r = new c({
            googleAnalyticsId: this.settings.googleAnalytics.limitedCounterId,
            sampleRate: this.settings.googleAnalytics.limitedCounterSampleRate,
            name: "limited"
        });
        r.track(n, i, s, a)
    };
    t.track = function(e) {
        var t;
        if (e.nonInteraction) {
            t = {
                nonInteraction: true
            }
        }
        window._ga("send", "event", e.category, e.action, e.label, e.value, t)
    };
    t.trackUrl = function(e) {
        window._ga("send", "pageview", e.pageView)
    };
    return t
});
define("analytics/events", ["common/dnevnik"], function() {
    "use strict";
    $.fn.live = $.fn.live || $.fn.on;
    $(document).ready(function() {
        $(".trackable").live("click", function(e) {
            var t = e.currentTarget,
                n = t.getAttribute("data-id"),
                i = t.getAttribute("data-action"),
                s = t.getAttribute("data-category");
            dnevnik.analytics.track({
                category: s,
                action: i,
                label: n
            })
        })
    })
});
define("analytics/yaMetrikaTracker", [], function() {
    "use strict";
    var n = function(n, i) {
        var e = dnevnik.settings.yandexMetrikaIds;
        var s = window.yandex_metrika_callbacks;
        e.forEach(e => {
            var t = "yaCounter" + e;
            if (!s && !(window[t] && window[t][n])) {
                s = window.yandex_metrika_callbacks = []
            }
            if (window[t] && window[t][n]) {
                window[t][n](i)
            } else if (s) {
                s.push(function() {
                    window[t][n](i)
                })
            }
        })
    };
    return {
        reachGoal: function(e) {
            var t = e.target;
            if (t) {
                n("reachGoal", t)
            }
        },
        params: function(e) {
            n("params", e)
        },
        getClientId: function(e) {
            n("getClientID", e)
        }
    }
});
define("analytics/analytics", ["common/dnevnik", "analytics/google", "analytics/events", "analytics/yaMetrikaTracker"], function() {
    "use strict";
    var e = arguments[0],
        t = arguments[1],
        n = arguments[3];
    e.namespace("dnevnik.analytics");
    e.analytics = function() {
        t.init();
        return {
            track: function(e) {
                if (t.track) {
                    t.track(e)
                }
            },
            trackUrl: function(e) {
                if (t.trackUrl) {
                    t.trackUrl(e)
                }
            },
            yandex: {
                reachGoal: function(e) {
                    if (n.reachGoal) {
                        n.reachGoal(e)
                    }
                },
                params: function(e) {
                    if (n.params) {
                        n.params(e)
                    }
                }
            }
        }
    }()
});
require(["common/dnevnik", "common/pubsub", "async/polling", "controls/controls", "analytics/analytics"], function() {
    "use strict";
    $.ajaxSetup({
        cache: false
    })
});
define("main-redesign", function() {});