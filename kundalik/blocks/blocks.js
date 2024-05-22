define("MessengerPage/MessengerPage", function() {
    "use strict";
    return function(model) {
        function hide() {
            window.location.href = model.markInfoMessageAsShownUrl
        }

        function buttonClick(url) {
            window.open(url, "_blank"), hide()
        }
        var appStoreButton, googlePlayButton = document.querySelector(".messenger_page__info-message-popup");
        googlePlayButton && ((appStoreButton = googlePlayButton.querySelector(".messenger_page__popup_exit")) && appStoreButton.addEventListener("click", hide), (appStoreButton = googlePlayButton.querySelector(".messenger_page__button_app-store")) && appStoreButton.addEventListener("click", function() {
            buttonClick(model.appStoreUrl)
        }), (googlePlayButton = googlePlayButton.querySelector(".messenger_page__button_google-play")) && googlePlayButton.addEventListener("click", function() {
            buttonClick(model.googlePlayUrl)
        }))
    }
});
define("NotStudyEditForm/NotStudyEditForm", ["Notification/Notification"], function(notify) {
    "use strict";
    var editModel;

    function getOptionsHtml(options) {
        var html = "<option>" + editModel.notSetText + "</option>";
        return options.forEach(function(item) {
            html += '<option value="' + item.id + '">' + item.text + "</option>"
        }), html
    }

    function unlink() {
        $(editModel.personId).val(""), $(editModel.likPersonBtnId).show(), $(editModel.linkedToId).hide()
    }
    return {
        studyingSelectInit: function() {
            $(editModel.studyingSelectId).change(function() {
                var valueSelected = this.value;
                valueSelected === editModel.notStudyingSelectOptionValue ? (unlink(), $(editModel.reasonAndTypeDivId).addClass(editModel.classForShowReasonAndTypeDiv)) : $(editModel.reasonAndTypeDivId).removeClass(editModel.classForShowReasonAndTypeDiv), valueSelected === editModel.studyingNotOftenSelectOptionValue ? $(editModel.profileBlockId).addClass(editModel.classForShowAddToProfileDiv) : $(editModel.profileBlockId).removeClass(editModel.classForShowAddToProfileDiv)
            })
        },
        init: function(model) {
            editModel = model
        },
        submitFormInit: function(notificate) {
            $("#btnSubmitCardForm").click(function() {
                var url = $(this).attr("data-url"),
                    model = $("#cardForm").serialize();
                return $.post(url, model, function(data) {
                    null != data.errors ? notificate.show(data.errors) : (notificate.show(), window.location.href = editModel.indexUrl)
                }), !1
            }), $(editModel.unlinkPersonBtn).click(function() {
                $(editModel.studyingSelectId).children("option:selected").val() === editModel.notStudyingSelectOptionValue && $(editModel.reasonAndTypeDivId).addClass(editModel.classForShowReasonAndTypeDiv), unlink()
            }), $(".checkbox-class input").click(function() {
                $(this).parent().hasClass("blue-checked-checkbox_checked") ? $(this).parent().removeClass("blue-checked-checkbox_checked") : $(this).parent().addClass("blue-checked-checkbox_checked")
            }), $(".radiobutton-class input").click(function() {
                $(this).parent().parent().children().removeClass("convex-radiobutton_checked"), $(this).parent().hasClass("convex-radiobutton_checked") ? $(this).parent().removeClass("convex-radiobutton_checked") : $(this).parent().addClass("convex-radiobutton_checked")
            })
        },
        typeSelectInit: function() {
            $(editModel.typeSelectId).change(function() {
                var valueSelected = this.value;
                editModel.reasonOptionsFroEachStudyType.forEach(function(item) {
                    item.typeId == valueSelected && $(editModel.reasonSelectId).empty().append(getOptionsHtml(item.options))
                })
            })
        },
        linkPersonInit: function() {
            $(editModel.likPersonBtnId).click(function() {
                $.get(editModel.linkPersonUrl, function(fio) {
                    $("body").append(fio);
                    fio = $(editModel.personLastNameId).val() + " " + $(editModel.personNameId).val() + " " + $(editModel.personMiddleNameId).val() + " (" + $(editModel.personBirthdayId).val() + ")";
                    $(editModel.fioId).text(fio),
                        function() {
                            var currentSchoolId = "";
                            $(editModel.schools).change(function() {
                                currentSchoolId = this.value, $.get(editModel.parallelUrl, {
                                    schoolId: currentSchoolId
                                }, function(pls) {
                                    $(editModel.parallels).empty().append(getOptionsHtml(pls)), $(editModel.groups).empty(), $(editModel.persons).empty()
                                })
                            }), $(editModel.parallels).change(function() {
                                var valueSelected = this.value;
                                $.get(editModel.groupUrl, {
                                    schoolId: currentSchoolId,
                                    parallelId: valueSelected
                                }, function(grs) {
                                    $(editModel.groups).empty().append(getOptionsHtml(grs)), $(editModel.persons).empty()
                                })
                            }), $(editModel.groups).change(function() {
                                var valueSelected = this.value;
                                $.get(editModel.personUrl, {
                                    groupId: valueSelected
                                }, function(prs) {
                                    $(editModel.persons).empty().append(getOptionsHtml(prs))
                                })
                            });
                            var personName = "";
                            $(editModel.persons).change(function() {
                                personName = " " + $("#" + $(this).attr("id") + " option:selected").text()
                            }), $(editModel.modalSubmitId).click(function() {
                                var linkedText;
                                return $(editModel.schools).val() === editModel.notSetText || null == $(editModel.schools).val() || $(editModel.parallels).val() === editModel.notSetText || null == $(editModel.parallels).val() || $(editModel.groups).val() === editModel.notSetText || null == $(editModel.groups).val() || $(editModel.persons).val() === editModel.notSetText || null == $(editModel.persons).val() ? $("#errorMessage").show() : ($("#errorMessage").hide(), linkedText = $(editModel.linkedProfileTextId).attr("data-linkedtext"), $(editModel.linkedProfileTextId).text(""), $(editModel.linkedProfileTextId).append(linkedText), $(editModel.linkedProfileTextId).append(personName), $(editModel.likPersonBtnId).hide(), $(editModel.linkedToId).show(), $(editModel.personId).val($(editModel.personLinkedForm).val()), $(editModel.modalId).remove()), !1
                            }), $("#cancelBtn").click(function() {
                                $(editModel.modalId).remove()
                            })
                        }()
                })
            })
        },
        notification: new notify
    }
});
define("NotStudyViewForm/NotStudyViewForm", function() {
    "use strict";
    var viewUrl, moveToDeleteUrl, removeConUrl, remUrl, reestablishConfUrl, reestablisUrl, indexUrl;

    function setAntiForgeryToken(data) {
        return data.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val(), data
    }

    function initChildLinks() {
        $(".show-view-card").click(function() {
            var id = $(this).attr("data-childid");
            $.get(viewUrl, {
                id: id
            }, function(html) {
                $("body").append(html), moveToDeletedInit(), initRemoveAndReestablishBtn(), initBtn()
            })
        }), moveToDeletedInit(), $(".removeConfirmClass").click(function() {
            var id = $(this).attr("data-childid");
            $.post(removeConUrl, {
                id: id
            }, function(html) {
                $("body").append(html), initRemoveAndReestablishBtn()
            })
        }), $(".reestablishConfirmClass").click(function() {
            var id = $(this).attr("data-childid");
            $.post(reestablishConfUrl, {
                id: id
            }, function(html) {
                $("body").append(html), initRemoveAndReestablishBtn()
            })
        })
    }

    function moveToDeletedInit() {
        $("#moveCardtoDeletedBtn").click(function() {
            var id = $(this).attr("data-childid");
            $("#popupNotStudyingChildren").remove(), $.post(moveToDeleteUrl, setAntiForgeryToken({
                id: id
            }), function(html) {
                $("body").append(html), initBtn()
            })
        })
    }

    function initBtn() {
        $("#cancelBtn").click(function() {
            $("#popupNotStudyingChildren").remove()
        }), $("#closepopup").click(function() {
            $("#popupNotStudyingChildren").remove(), window.location.href = indexUrl
        })
    }

    function initRemoveAndReestablishBtn() {
        $("#removeBtn").click(function() {
            var id = $(this).attr("data-childid");
            $("#popupNotStudyingChildren").remove(), $.post(remUrl, setAntiForgeryToken({
                id: id
            }), function(html) {
                $("body").append(html), initBtn()
            })
        }), $("#reestablishBtn").click(function() {
            var id = $(this).attr("data-childid");
            $("#popupNotStudyingChildren").remove(), $.post(reestablisUrl, setAntiForgeryToken({
                id: id
            }), function(html) {
                $("body").append(html), initBtn()
            })
        }), $("#undopopup").click(function() {
            $("#popupNotStudyingChildren").remove()
        })
    }
    return {
        init: function(cardViewUrl, moveCardToDeleteBtn, removeConfirmUrl, removeUrl, reestablishConfirmUrl, reestablishUrl, urlIndex) {
            viewUrl = cardViewUrl, moveToDeleteUrl = moveCardToDeleteBtn, removeConUrl = removeConfirmUrl, remUrl = removeUrl, reestablishConfUrl = reestablishConfirmUrl, reestablisUrl = reestablishUrl, indexUrl = urlIndex, initChildLinks()
        }
    }
});
define("BlueCheckbox/BlueCheckbox", function() {
    return function(model) {
        var input = document.getElementById(model.id).querySelector('input[type="checkbox"]');
        model.redirectTo && input.addEventListener("change", function() {
            window.location.href = model.redirectTo
        })
    }
});
define("BlueCheckbox/BlueCheckbox_switch-user-current-progress-mode", ["common/dnevnik", "dialogs/dialogs"], function() {
    return function(model) {
        var oldChecked, dialogs = dnevnik.dialogs,
            input = document.getElementById(model.id).querySelector('input[type="checkbox"]');
        model.options.switchUrl && (oldChecked = input.checked, input.addEventListener("change", function() {
            $.ajax({
                type: "POST",
                url: model.options.switchUrl,
                crossDomain: !0,
                xhrFields: {
                    withCredentials: !0
                },
                dataType: "json",
                data: {
                    alwaysDnevnik: input.checked
                },
                success: function(data) {
                    !0 === data.hasError ? (input.checked = oldChecked, dialogs.error(data.error)) : input.checked = data.alwaysDnevnik
                },
                error: function(xhr, status, error) {
                    input.checked = oldChecked, dnevnik.messageBox.showErrorMsg(error)
                }
            })
        }))
    }
});
define("Calendar/Calendar", function() {
    "use strict";
    var elements = {};
    return function(param) {
        if (param) {
            if ("string" == typeof param) return elements[param];
            if (param.hasOwnProperty("clientId")) return function(model) {
                var dateInput = document.getElementById(model.clientId);
                if (!dateInput) throw 'Element not found. Element ID = "' + model.clientId + '".';
                if (!(dateInput instanceof HTMLInputElement && ("text" === dateInput.type || !dateInput.type))) throw "Invalid element type. Should be text input";
                var elem = JSON.parse(model.calendarParams);
                return elem.onDateSelected = function() {
                    var event = document.createEvent("CustomEvent");
                    event.initCustomEvent("DateSelected", !0, !0, {}), dateInput.dispatchEvent(event)
                }, elem = $(dateInput).calendar(elem)[0], elements[model.clientId] = elem
            }(param)
        }
    }
});
define("Captcha/Captcha", ["controls/captcha"], function(captcha) {
    "use strict";
    return function(model) {
        model.refreshButton = "captcha__button", model.valueField = "captcha__value", model.inputField = "input_captcha-validation", model.imageChild = "captcha__image", captcha(model)
    }
});
define("ChangePassword/ChangePassword", ["../../modules/utils/ajax-request-manager"], function(AjaxManager) {
    new AjaxManager;
    return function(model) {
        var login = model.login,
            reliabilityValue = model.submitClass,
            doc = document,
            firstPassword = doc.querySelector(".input__first-password"),
            secondPassword = doc.querySelector(".input__second-password"),
            firstPasswordHint = doc.querySelector(".yellow-hint_first-password"),
            secondPasswordHint = doc.querySelector(".yellow-hint_second-password"),
            reliability = doc.querySelectorAll(".change-password__password-reliability__line"),
            text = doc.querySelector(".change-password__password-reliability__text"),
            submitButton = doc.getElementsByClassName(reliabilityValue)[0],
            isStaff = model.isStaff,
            isStrongValidationEnable = model.isStrongValidationEnable,
            reliabilityValue = model.reliability,
            resources = model.resources,
            lenConstants = model.validation.lenConstants,
            cyrillicValidatorPattern = new RegExp(model.validation.cyrillicValidatorPattern),
            passwordSymbolsValidatorPattern = new RegExp(model.validation.passwordSymbolsValidatorPattern),
            unreliable2RegexCapital = new RegExp(model.validation.strengthPatterns.unreliable2RegexCapital),
            unreliable2RegexNoncapital = new RegExp(model.validation.strengthPatterns.unreliable2RegexNoncapital),
            unreliable2RegexCapiatalAndNoncapital = new RegExp(model.validation.strengthPatterns.unreliable2RegexCapiatalAndNoncapital),
            unreliable2RegexSymbolsOnly = new RegExp(model.validation.strengthPatterns.unreliable2RegexSymbolsOnly),
            unreliable2RegexNumbersOnly = new RegExp(model.validation.strengthPatterns.unreliable2RegexNumbersOnly),
            goodRegexCapitalAndNumbers = new RegExp(model.validation.strengthPatterns.goodRegexCapitalAndNumbers),
            goodRegexNoncapitalAndNumbers = new RegExp(model.validation.strengthPatterns.goodRegexNoncapitalAndNumbers),
            goodRegexNoncapitalAndSymbols = new RegExp(model.validation.strengthPatterns.goodRegexNoncapitalAndSymbols),
            goodRegexCapitalAndSymbols = new RegExp(model.validation.strengthPatterns.goodRegexCapitalAndSymbols),
            necessaryCapital = new RegExp(model.validation.passwordNecessarySymbolsValidator.capital),
            necessaryNoncapital = new RegExp(model.validation.passwordNecessarySymbolsValidator.noncapital),
            necessaryCapitalAndNonCapital = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalAndNoncapital),
            necessarySymbolsOnly = new RegExp(model.validation.passwordNecessarySymbolsValidator.symbolsOnly),
            necessaryNumbersOnly = new RegExp(model.validation.passwordNecessarySymbolsValidator.numbersOnly),
            necessaryNoncapitalAndNumbers = new RegExp(model.validation.passwordNecessarySymbolsValidator.noncapitalAndNumbers),
            necessaryNoncapitalAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.noncapitalAndSymbols),
            necessaryNoncapitalNumbersAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.noncapitalNumbersAndSymbols),
            necessaryCapitalAndNumbers = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalAndNumbers),
            necessaryCapitalAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalAndSymbols),
            necessaryCapitalNumbersAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalNumbersAndSymbols),
            necessaryNumbersAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.numbersAndSymbols),
            necessaryCapitalNoncapitalAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalNoncapitalAndSymbols),
            necessaryCapitalNoncapitalAndNumbers = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalNoncapitalAndNumbers),
            recommendationAtLeastTwoCapitals = new RegExp(model.validation.strongStrengthPatterns.atLeastTwoCapitals),
            recommendationAtLeastTwoSymbols = new RegExp(model.validation.strongStrengthPatterns.atLeastTwoSymbols);
        submitButton.addEventListener("click", function() {
            submitButton.setAttribute("disabled", "disabled"), document.forms[0].submit()
        });

        function resetView() {
            secondPassword.classList.remove("input_correctly");
            for (var i = 0, l = reliability.length; i < l; i += 1) reliability[i].classList.remove("change-password__password-reliability__line_red", "change-password__password-reliability__line_yellow", "change-password__password-reliability__line_green")
        }

        function setReliability(rel) {
            if (rel) {
                var reliabilityClass = "";
                switch (rel) {
                    case 1:
                    case 2:
                        reliabilityClass = "change-password__password-reliability__line_red";
                        break;
                    case 3:
                    case 4:
                        reliabilityClass = "change-password__password-reliability__line_yellow";
                        break;
                    case 5:
                        reliabilityClass = "change-password__password-reliability__line_green"
                }
                for (var i = 0, l = rel; i < l; i += 1) reliability[i].classList.add(reliabilityClass)
            }
        }

        function updateView(data) {
            resetView(), firstPasswordHint.classList.add("yellow-hint_hidden"), secondPasswordHint.classList.add("yellow-hint_hidden"), data.SecondPassword && secondPassword.classList.add("input_correctly"), data.FirstPasswordHint && (firstPasswordHint.classList.remove("yellow-hint_hidden"), firstPasswordHint.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = data.FirstPasswordHint), data.SecondPasswordHint && (secondPasswordHint.classList.remove("yellow-hint_hidden"), secondPasswordHint.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = data.SecondPasswordHint), setReliability(data.Reliability), data.Recomendation ? text.textContent = data.Recomendation : text.textContent = ""
        }

        function validatePass(trimmedPas, isStaff, isStrongValidationEnable, login) {
            var result = {
                FirstPassword: !0,
                SecondPassword: !1
            };
            return trimmedPas ? cyrillicValidatorPattern.test(trimmedPas) ? (result.FirstPasswordHint = resources.rootPasswordValidationLatinonly, result) : passwordSymbolsValidatorPattern.test(trimmedPas) ? isStaff && trimmedPas.length < lenConstants.systemMinLength ? (isStrongValidationEnable ? (result.FirstPasswordHint = resources.rootPasswordValidationSystemStrongShortformat, result.Reliability = 2) : result.FirstPasswordHint = resources.rootPasswordValidationSystemShortformat, result) : trimmedPas.length < lenConstants.minLength ? (result.FirstPasswordHint = resources.rootPasswordValidationShortformat, result) : trimmedPas.length > lenConstants.maxLength ? (result.FirstPasswordHint = resources.rootPasswordValidationLongformat, result) : login.toUpperCase() === trimmedPas.toUpperCase() ? (result.FirstPasswordHint = resources.rootPasswordValidationCreatenew, result) : isStrongValidationEnable ? function(trimmedPas) {
                var result = {
                    FirstPassword: !0,
                    SecondPassword: !1,
                    Reliability: 2
                };
                return necessaryCapital.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapital, result) : necessaryNoncapital.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNoncapital, result) : necessaryCapitalAndNonCapital.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalAndNoncapital, result) : necessarySymbolsOnly.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationSymbolsOnly, result) : necessaryNumbersOnly.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNumbersOnly, result) : necessaryNoncapitalAndNumbers.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNoncapitalAndNumbers, result) : necessaryNoncapitalAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNoncapitalAndSymbols, result) : necessaryNoncapitalNumbersAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNoncapitalNumbersAndSymbols, result) : necessaryCapitalAndNumbers.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalAndNumbers, result) : necessaryCapitalAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalAndSymbols, result) : necessaryCapitalNumbersAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalNumbersAndSymbols, result) : necessaryNumbersAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNumbersAndSymbols, result) : necessaryCapitalNoncapitalAndNumbers.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalNoncapitalAndNumbers, result) : necessaryCapitalNoncapitalAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalNoncapitalAndSymbols, result) : null
            }(trimmedPas) : null : (result.FirstPasswordHint = resources.rootPasswordValidationDisallowedsymbols, result) : (result.FirstPasswordHint = resources.rootPasswordValidationEmpty, result)
        }

        function checkPasswordOnClient() {
            var password, repeatedPassword, strength = firstPassword.value.trim(),
                result = validatePass(strength, isStaff, isStrongValidationEnable, login);
            result ? updateView(result) : ((strength = isStrongValidationEnable ? (password = strength, repeatedPassword = secondPassword.value.trim(), result = {
                FirstPassword: !0,
                SecondPassword: !1,
                Reliability: 4
            }, recommendationAtLeastTwoCapitals.test(password) && recommendationAtLeastTwoSymbols.test(password) && password.length === lenConstants.recommendedLength - 1 ? result.FirstPasswordHint = resources.recommendationAddOneLetter : !recommendationAtLeastTwoCapitals.test(password) && recommendationAtLeastTwoSymbols.test(password) ? result.FirstPasswordHint = resources.recommendationAddCapital : recommendationAtLeastTwoCapitals.test(password) && !recommendationAtLeastTwoSymbols.test(password) ? result.FirstPasswordHint = resources.recommendationAddSymbol : recommendationAtLeastTwoCapitals.test(password) && !recommendationAtLeastTwoSymbols.test(password) && password.length === lenConstants.recommendedLength - 2 ? result.FirstPasswordHint = resources.recommendationAddSymbolAndOneLetter : !recommendationAtLeastTwoCapitals.test(password) && recommendationAtLeastTwoSymbols.test(password) && password.length === lenConstants.recommendedLength - 2 ? result.FirstPasswordHint = resources.recommendationAddCapitalAndOneLetter : recommendationAtLeastTwoCapitals.test(password) && recommendationAtLeastTwoSymbols.test(password) && password.length === lenConstants.recommendedLength - 2 ? result.FirstPasswordHint = resources.recommendationAddTwoLetters : recommendationAtLeastTwoCapitals.test(password) || recommendationAtLeastTwoSymbols.test(password) ? (result.Reliability = 5, repeatedPassword ? password !== repeatedPassword ? result.SecondPasswordHint = resources.rootPasswordValidationNomatch : result.SecondPassword = !0 : result.FirstPassword = !1) : result.FirstPasswordHint = resources.recommendationAddCapitalAndSymbol, result) : function(password, repeatedPassword) {
                var result = {
                    FirstPassword: !0,
                    SecondPassword: !1
                };
                return unreliable2RegexCapital.test(password) || unreliable2RegexNoncapital.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationUnreliableonlyletters, result.Reliability = 2) : unreliable2RegexCapiatalAndNoncapital.test(password) ? (result.Reliability = 2, result.FirstPasswordHint = resources.rootPasswordValidationUnreliableonlyletters2) : unreliable2RegexNumbersOnly.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationUnreliableonlynumbers, result.Reliability = 2) : unreliable2RegexSymbolsOnly.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationUnreliableonlysymbols, result.Reliability = 2) : goodRegexCapitalAndNumbers.test(password) || goodRegexNoncapitalAndNumbers.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationGoodOnlylettersAndNumbers, result.Reliability = 4) : goodRegexCapitalAndSymbols.test(password) || goodRegexNoncapitalAndSymbols.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationGoodOnlylettersAndSymbols, result.Reliability = 4) : (result.Reliability = 5, repeatedPassword ? password !== repeatedPassword ? result.SecondPasswordHint = resources.rootPasswordValidationNomatch : result.SecondPassword = !0 : result.FirstPassword = !1), result
            }(strength, secondPassword.value.trim())).Recomendation = function(strength) {
                return 1 === strength.Reliability || 2 === strength.Reliability || 3 === strength.Reliability ? resources.errorUserPasswordCheckStrengthBad : 4 === strength.Reliability ? resources.errorUserPasswordCheckStrengthGood : 5 === strength.Reliability ? resources.errorUserPasswordCheckStrengthExcellent : ""
            }(strength), updateView(strength))
        }
        resetView(), firstPassword.addEventListener("input", function() {
            checkPasswordOnClient()
        }, !1), secondPassword.addEventListener("input", function() {
            checkPasswordOnClient()
        }, !1), reliabilityValue && setReliability(reliabilityValue), this.setLogin = function(value) {
            login = value
        }, this.check = function() {
            checkPasswordOnClient()
        }
    }
});
define("Checkbox/Checkbox", function() {
    return function(id) {
        var label = document.getElementById(id),
            checkbox = label.getElementsByTagName("input")[0],
            valueInput = label.getElementsByClassName("checkbox-value")[0];
        label.addEventListener("click", function(e) {
            e.preventDefault(), label.classList.contains("checkbox_checked") ? (checkbox.removeAttribute("checked"), label.classList.remove("checkbox_checked"), valueInput.setAttribute("value", "false")) : (checkbox.setAttribute("checked", "checked"), label.classList.add("checkbox_checked"), valueInput.setAttribute("value", "true"))
        })
    }
});
define("DropdownContainer/DropdownContainer", ["blocks/dropdownContainer/dropdownContainer"], function(dropdown) {
    "use strict";
    return function(model) {
        dropdown(model)
    }
});
define("Footer/Footer", ["blocks/footer/footer"], function(footer) {
    return function() {
        footer()
    }
});
define("Input/Input_money", function() {
    "use strict";
    return function(inputHandler) {
        var inputHandler = inputHandler.id,
            input = document.getElementById(inputHandler),
            lastValue = input.value,
            replacer = function(matches) {
                var newValue = matches.replace(/^0|^\,|[^\d\,]/g, ""),
                    matches = newValue.match(/(\d+[,]?\d{0,2})/g);
                return matches && 0 < matches.length && (newValue = matches[0]), newValue = newValue.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ")
            },
            inputHandler = function() {
                var newValue = (newValue = input.value.replace(".", ",")).replace(" ", ""); - 1 !== lastValue.indexOf(",") && newValue.lastIndexOf(",") !== newValue.indexOf(",") || 8 < newValue.length ? input.value = lastValue : (newValue = replacer(newValue), lastValue = newValue, input.value = newValue)
            };
        input.addEventListener("input", inputHandler)
    }
});
define("Input/Input_name", function() {
    "use strict";
    return function(inputHandler) {
        var inputHandler = inputHandler.id,
            input = document.getElementById(inputHandler),
            replacer = function(value) {
                return value.replace(/^[^A-Za-zА-Яа-я`\-\s]/g, "")
            },
            inputHandler = function() {
                var replacedValue = input.value,
                    replacedValue = replacer(replacedValue);
                input.value = replacedValue
            };
        input.addEventListener("input", inputHandler)
    }
});
define("Input/Input_number", function() {
    "use strict";
    return function(max) {
        var id = max.generatedId,
            min = max.minValue && 1 === max.maxLength ? max.minValue : 0,
            max = max.maxValue ? max.maxValue : 9,
            input = document.getElementById(id),
            pattern = new RegExp("[^{0}-{1}+]".replace("{0}", min).replace("{1}", max));
        input.oninput = function() {
            var value = input.value;
            input.value = value.replace(pattern, "")
        }
    }
});
define("Input/Input_phone", function() {
    "use strict";
    return function(model) {
        var id = model.id,
            input = document.getElementById(id),
            template = model.template || "+7 ( <%= this[0] %><%= this[1] %><%= this[2] %> ) <%= this[3] %><%= this[4] %><%= this[5] %><%= this[6] %><%= this[7] %><%= this[8] %><%= this[9] %>",
            countyCodeLastIndex = template.indexOf("<%= this[0] %>");

        function getCatchedNumbersCount() {
            return input.value.substring(countyCodeLastIndex, input.selectionStart).replace(/\D/g, "").length
        }

        function cutCountryCode(value) {
            return value.substring(countyCodeLastIndex)
        }

        function position(numbers, catchedNumbersCount) {
            numbers = Array.from(cutCountryCode(numbers).matchAll(/[\d]/g)).map(function(x) {
                return x.index
            });
            return input.selectionEnd <= countyCodeLastIndex || 0 === numbers.length ? countyCodeLastIndex : numbers[catchedNumbersCount - 1] + 1 + countyCodeLastIndex
        }

        function cursor(p) {
            input.setSelectionRange(p, p)
        }

        function cursorHandler(e) {
            var catchedNumbersCount = getCatchedNumbersCount();
            cursor(position(e.target.value, catchedNumbersCount))
        }

        function spaces(n) {
            return n = n || model.phoneLength, new Array(n).join(" ")
        }
        return template = _.template(template), 0 === input.value.length && input.setAttribute("value", template.call(spaces())), input.addEventListener("focus", cursorHandler), input.addEventListener("click", cursorHandler), input.addEventListener("keydown", cursorHandler), input.addEventListener("input", function(e) {
            var newValue = cutCountryCode(input.value).replace(/\D/g, ""),
                pos = getCatchedNumbersCount(),
                newValue = newValue.length > model.phoneLength ? template.call(newValue.substring(0, model.phoneLength)) : template.call(newValue.concat(spaces(model.phoneLength - newValue.length))),
                pos = pos > model.phoneLength ? newValue.length : position(newValue, pos);
            input.value = newValue, cursor(pos)
        }), {
            clear: function() {
                input.value = template.call(spaces())
            }
        }
    }
});
define("LikeAndShare/LikeAndShare", function() {
    var Likes = function() {
        function Likes() {
            this.requests = {}, this.callbacks = {}, this.windows = {}
        }
        return Likes.prototype.register = function(settings) {
            this.requests[settings.type] = {
                url: settings.requestUrl,
                dataType: settings.dataType
            }, this.callbacks[settings.type] = settings.callback, this.windows[settings.type] = {
                url: settings.windowUrl,
                width: settings.windowParameters.width,
                height: settings.windowParameters.height
            }, settings.init && settings.init()
        }, Likes.prototype.makeRequest = function(callback) {
            var like = this.requests[callback],
                callback = this.callbacks[callback];
            like.url && $.ajax({
                url: like.url,
                dataType: "jsonp",
                type: "GET",
                success: callback
            })
        }, Likes.prototype.popup = function(item) {
            var p, self = this,
                item = this.windows[item],
                parametersString = "",
                params = {
                    width: item.width,
                    height: item.height,
                    left: Math.round(screen.width / 2 - item.width / 2),
                    top: screen.height > item.height ? Math.round(screen.height / 3 - item.height / 2) : 0,
                    personalbar: 0,
                    toolbar: 0,
                    scrollbars: 1,
                    resizable: 1
                };
            for (p in params) parametersString += p + "=" + params[p] + ",";
            var timer, win = window.open(item.url, null, parametersString);
            win ? (win.focus(), timer = setInterval(function() {
                win.closed && (clearInterval(timer), self.refresh())
            }, 1e3)) : location.href = item.url
        }, Likes.prototype.refresh = function() {
            for (var r in this.requests) this.makeRequest(r)
        }, Likes
    }();
    return function(model) {
        function getCounter(type) {
            return doc.getElementsByClassName("likes__counter_" + type)[0]
        }
        var i, length, likes = new Likes,
            doc = document,
            url = doc.URL,
            protocol = location.protocol,
            links = doc.getElementsByClassName("likes__icon"),
            vkCounter = getCounter("vk");
        vkCounter && likes.register({
            type: "vk",
            requestUrl: "//vk.com/share.php?act=count&index=1&url=" + encodeURIComponent(url),
            init: function() {
                window.VK || (window.VK = {}), window.VK.Share = {
                    count: function(idx, number) {
                        vkCounter.innerHTML = number
                    }
                }
            },
            windowUrl: protocol + "//vk.com/share.php?url=" + encodeURIComponent(url) + "&image=" + encodeURI(model.imageUrl) + "&title=" + encodeURIComponent(model.title) + "&description=" + encodeURIComponent(model.description),
            windowParameters: {
                height: 550,
                width: 330
            }
        });
        var okCounter = getCounter("ok");
        okCounter && likes.register({
            type: "ok",
            callback: function(response) {
                response && response.count && (okCounter.innerHTML = response.count)
            },
            windowUrl: protocol + "//www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl=" + encodeURI(url),
            windowParameters: {
                width: 550,
                height: 360
            }
        });
        var mailCounter = getCounter("mail");
        mailCounter && likes.register({
            type: "mail",
            requestUrl: "//connect.mail.ru/share_count?url_list=" + encodeURIComponent(url) + "&callback=1&func=?",
            callback: function(response) {
                response && response[url] && (mailCounter.innerHTML = response[url].shares)
            },
            windowUrl: protocol + "//connect.mail.ru/share?share_url=" + encodeURIComponent(url) + "&title=" + model.title + "&description=" + model.description + "&image_url=" + encodeURI(model.imageUrl),
            windowParameters: {
                width: 550,
                height: 360
            }
        });
        var fbCounter = getCounter("fb");
        for (fbCounter && likes.register({
                type: "fb",
                requestUrl: "//graph.facebook.com/?id=" + url,
                callback: function(response) {
                    response && response.shares && (fbCounter.innerHTML = response.shares)
                },
                windowUrl: protocol + "//www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url),
                windowParameters: {
                    width: 600,
                    height: 500
                }
            }), i = 0, length = links.length; i < length; i += 1) links[i].addEventListener("click", function() {
            likes.popup(this.getAttribute("data-like"))
        }, !1);
        likes.refresh()
    }
});
define("LinesBothSides/LinesBothSides", function() {
    return function() {
        this.render = function(model) {
            document.getElementsByClassName("lines-both-sides__title__text")[0].innerHTML = model
        }
    }
});
define("LocalizationSelect/LocalizationSelect", ["blocks/localizationSelect/localizationSelect"], function(select) {
    return function(model) {
        select(model)
    }
});
define("LocationAutocomplete/LocationAutocomplete", function() {
    return function(doc) {
        function change(e) {
            block.change && block.change(e)
        }

        function setSelectedCity(dataId) {
            selectedCity.setAttribute("value", dataId)
        }

        function resetDistricts() {
            districts.reset(), districtsInput.value = districtsSelectedQuery.value = "", districtsInput.placeholder = districtsText.textContent = districtsDefaultText
        }
        var id = doc.id,
            cityWrapper = doc.citiesId,
            districtsId = doc.districtsId,
            districtsDefaultText = doc.districtsDefaultText,
            citiesDefaultText = doc.citiesDefaultText,
            doc = document,
            block = doc.getElementById(id),
            cities = doc.getElementById(cityWrapper),
            cityWrapper = block.getElementsByClassName("location-autocomplete__wrapper")[0],
            cityInput = cityWrapper.getElementsByClassName("select-box__input-wrapper__block-for-input__input")[0],
            cityText = cityWrapper.getElementsByClassName("select-box__default-text")[0],
            districtsWrapper = block.getElementsByClassName("location-autocomplete__wrapper_districts")[0],
            districtsInput = districtsWrapper.getElementsByClassName("select-box__input-wrapper__block-for-input__input")[0],
            districtsText = districtsWrapper.getElementsByClassName("select-box__default-text")[0],
            districtsSelectedQuery = districtsWrapper.getElementsByClassName("select-box__selected-query")[0],
            districts = doc.getElementById(districtsId),
            selectedCity = block.getElementsByClassName("location-autocomplete__value")[0];
        cities.onItemChanged = function(e) {
            var event, link, dataId;
            e && (e.preventDefault(), event = (dataId = e.target).getAttribute("data-event"), link = dataId.getAttribute("href"), dataId = dataId.getAttribute("data-id"), "event" === event ? (districtsWrapper.classList.remove("location-autocomplete__wrapper_hidden"), resetDistricts(), districts.changeUrl(link), districts.load("", !0), change(), setSelectedCity(dataId)) : (districtsWrapper.classList.add("location-autocomplete__wrapper_hidden"), districts.reset(), null === dataId ? change() : (setSelectedCity(dataId), change(e))))
        }, districts.onItemChanged = function(e) {
            var dataId;
            e && (change(e), null === (dataId = e.target.getAttribute("data-id")) ? (resetDistricts(), change()) : (setSelectedCity(dataId), change(e)))
        }, cities.onAnotherClicked = function() {
            cities.reset(), cityInput.value = "", cityInput.placeholder = cityText.textContent = citiesDefaultText, resetDistricts(), districtsWrapper.classList.add("location-autocomplete__wrapper_hidden"), setSelectedCity(0)
        }
    }
});
define("NewCalendar/NewCalendar", ["NewCalendar/NewCalendar_Utils"], function(calendarUtils) {
    return function(model) {
        model.isFixed ? calendarUtils.initFixed(document.getElementById(model.generatedId), model.months, model.monthsShort, model.fromDateString, model.toDateString, model.defaultDateString) : calendarUtils.init(document.getElementById(model.generatedId), model.months, model.monthsShort, model.fromDateString, model.toDateString, model.defaultDateString)
    }
});
define("NewCalendar/NewCalendar_Utils", ["utils/dispatchevent"], function(eventDispatcher) {
    function init(element, months, monthsShort, fromDate, toDate, defaultDate) {
        $(element).calendar({
            months: months,
            months_short: monthsShort,
            showTodayButton: !1,
            containerClass: "new-calendar",
            monthYearTemplate: "{month} {year}",
            fromDate: fromDate,
            toDate: toDate,
            defaultDate: defaultDate || null,
            onDateSelected: function(e) {
                eventDispatcher.call(null, "change", element)
            }
        })
    }
    return {
        init: init,
        initFixed: function(element, months, monthsShort, fromDate, toDate, defaultDate) {
            init(element, months, monthsShort, fromDate, toDate, defaultDate), $(element).focus(function() {
                var self = $(this),
                    timer = setInterval(function() {
                        clearInterval(timer);
                        self.parent("div");
                        $(".new-calendar").css({
                            position: "fixed",
                            top: self.offset().top - $(document).scrollTop() + 40
                        })
                    }, 3)
            })
        }
    }
});
define("MosregSidebar/MosregSidebar", function() {
    "use strict";
    return function() {
        var submenuTriggerBtn = document.querySelector(".mosreg-submenu-button"),
            submenuList = document.querySelector(".mosreg-submenu-list"),
            submenuIcon = document.querySelector(".mosreg-submenu-button__icon");
        submenuTriggerBtn && submenuTriggerBtn.addEventListener("click", function() {
            submenuList.classList.toggle("mosreg-submenu-list_active"), submenuIcon.classList.toggle("mosreg-submenu-button__icon_active")
        })
    }
});
define("Notification/Notification", function() {
    "use strict";
    var changesSavedMessage;
    return function(model) {
        var self = this,
            notificationDiv = document.querySelector(".reports-notification");
        model && (changesSavedMessage = model.changesSavedMessage);
        self.show = function(errorList) {
            errorList && 0 < errorList.length ? (notificationDiv.innerHTML = "", notificationDiv.classList.add("reports-notification_error"), errorList.forEach(function(item) {
                notificationDiv.innerHTML += "<span>" + item + "</span><br />"
            })) : (notificationDiv.classList.remove("reports-notification_error"), notificationDiv.innerHTML = changesSavedMessage), notificationDiv.classList.add("reports-notification_active")
        }, self.hide = function() {
            notificationDiv.classList.remove("reports-notification_active")
        }, notificationDiv.addEventListener("click", function(e) {
            e.stopPropagation(), e.target.classList.contains("reports-notification_active") && self.hide()
        }, !1)
    }
});
define("RadioButton/RadioButton", function() {
    return function(labelWithRadio) {
        var doc = document,
            labelWithRadio = doc.getElementById(labelWithRadio.id),
            triggerRadio = function(selectedLabel) {
                for (var selectedRadio = selectedLabel.getElementsByClassName("radio-button__input")[0], radios = doc.getElementsByClassName("radio-button__input"), i = 0; i < radios.length; i++) r = radios[i], r.removeAttribute("checked"), r.parentNode.classList.remove("radio-button_checked");
                selectedLabel.classList.add("radio-button_checked"), selectedRadio.setAttribute("checked", "checked")
            };
        labelWithRadio.addEventListener("click", function(e) {
            this.classList.contains("radio-button_checked") || triggerRadio(this)
        }, !1)
    }
});
define("Popup/Popup", function() {
    "use strict";
    return function(model) {
        var popup = document.querySelector('div[data-popup-id="' + model.id + '"]');
        this.getPopup = function() {
            return popup
        };
        var overlay, originalPosition = document.body.style.overflow,
            show = this.showPopup = function() {
                popup.setAttribute("data-meta-originalOverflow", document.body.style.overflow), document.body.style.overflow = "hidden", popup.classList.add("popup_active")
            },
            hide = this.hidePopup = function(isCancelled, cancellationOnly) {
                document.body.style.overflow = popup.getAttribute("data-meta-originalOverflow") || originalPosition, popup.classList.remove("popup_active"), isCancelled && popup.onCancel && popup.onCancel(), !cancellationOnly && popup.onItemClosed && popup.onItemClosed()
            },
            titleElement = popup.querySelector(".popup__title");
        this.setTitle = function(title) {
            (titleElement.innerText = title) && !popup.classList.contains("popup_with-header") && popup.classList.add("popup_with-header")
        }, this.toggleTitle = function(showTitle) {
            showTitle ? popup.classList.add("popup_with-header") : popup.classList.remove("popup_with-header")
        };
        if (model.openTriggerSelector)
            for (var openTriggers = document.querySelectorAll(model.openTriggerSelector), i = 0; i < openTriggers.length; i++) openTriggers[i].addEventListener("click", function(e) {
                model.openTriggerAction && model.openTriggerAction(e), show()
            });
        model.canExit && (!model.closeTriggerSelector || (overlay = (model.isInnerCloseTrigger ? popup : document).querySelector(model.closeTriggerSelector)) && overlay.addEventListener("click", hide), (overlay = popup.querySelector(".popup__exit")) && overlay.addEventListener("click", hide), (overlay = popup.querySelector("div.popup__overlay")) && overlay.addEventListener("click", hide), document.addEventListener("keydown", function(e) {
            27 === e.keyCode && hide(!0)
        })), model.show && show(), model.show && model.hidePopupAutomatically && setTimeout(hide, 3e3)
    }
});
define("RadioButtonGroup/RadioButtonGroup", function() {
    "use strict";
    return function(model) {
        for (var ids = model.ids, radios = [], i = 0; i < ids.length; i++) {
            var element = document.getElementById(ids[i]);
            radios[i] = {
                label: element,
                input: element.getElementsByTagName("input")[0]
            }, radios[i].label.addEventListener("click", function(e) {
                ! function(selectedLabel) {
                    if (!selectedLabel.classList.contains("convex-radiobutton_checked") && "disabled" !== selectedLabel.getElementsByTagName("input")[0].getAttribute("disabled")) {
                        for (var i = 0; i < ids.length; i++) radios[i].input.removeAttribute("checked"), radios[i].label.classList.remove("convex-radiobutton_checked");
                        var selectedRadio = selectedLabel.getElementsByTagName("input")[0];
                        selectedLabel.classList.add("convex-radiobutton_checked"), selectedRadio.setAttribute("checked", "checked")
                    }
                }(this)
            }, !1)
        }
    }
});
define("Select/Select", function() {
    return function(options) {
        var optionHandler, listItemsBuilder, optionsBuilder, clickFunction = options.id,
            doc = document,
            wrapper = doc.getElementById(clickFunction),
            text = wrapper.getElementsByClassName("select-wrapper__default-text")[0],
            defaultText = wrapper.getElementsByClassName("select-wrapper__choose-text")[0],
            select = wrapper.getElementsByClassName("select")[0],
            arrow = wrapper.getElementsByClassName("select-wrapper__arrow")[0],
            list = wrapper.getElementsByClassName("select-list")[0],
            options = list.getElementsByClassName("select-list__item"),
            selectedValueInput = wrapper.getElementsByClassName("select-value")[0],
            overlappedInputs = doc.getElementsByClassName("input_element-overlapped-by-select");

        function selectListToggleFunction(show) {
            list.classList.toggle("select-list_active", show), _.each(overlappedInputs, function(item) {
                item.classList.toggle("input_element-overlapped-by-select_invisible", show)
            })
        }
        optionHandler = function() {
            selectListToggleFunction(!1), text.innerHTML = this.innerHTML, text.classList.add("select-wrapper__default-text_color-black");
            var value = this.getAttribute("data-value");
            selectedValueInput.value = value, select.querySelectorAll('option[value="' + value + '"]')[0].setAttribute("selected", "selected"), wrapper.change && wrapper.change(this)
        }, listItemsBuilder = function(objects) {
            var fragment = doc.createDocumentFragment();
            return _.each(objects, function(item) {
                var li = doc.createElement("li");
                li.classList.add("select-list__item"), li.setAttribute("data-value", item.value), li.textContent = item.text, li.addEventListener("click", optionHandler), fragment.appendChild(li)
            }), fragment
        }, optionsBuilder = function(objects) {
            var fragment = doc.createDocumentFragment();
            return _.each(objects, function(item) {
                var option = doc.createElement("option");
                option.setAttribute("value", item.value), fragment.appendChild(option)
            }), fragment
        }, clickFunction = function(e) {
            e.preventDefault(), e.stopPropagation(), selectListToggleFunction(!list.classList.contains("select-list_active")), setTimeout(function() {
                select.blur()
            }, 0)
        };
        select.addEventListener("click", clickFunction), arrow.addEventListener("click", clickFunction), document.addEventListener("click", function(e) {
            for (var target = e.target; target !== document;) {
                if (target === wrapper) return;
                target = target.parentNode
            }
            selectListToggleFunction(!1)
        }, !0), wrapper.update = function(objects) {
            var itemsFragment = listItemsBuilder(objects),
                optionsFragment = optionsBuilder(objects);
            select.innerHTML = "", select.appendChild(optionsFragment), select.setAttribute("size", objects.length), list.innerHTML = "", list.appendChild(itemsFragment), text.innerHTML = defaultText.innerHTML, text.classList.remove("select-wrapper__default-text_color-black"), selectedValueInput.value = "", 0 < objects.length && (select.classList.remove("select_hidden"), list.classList.remove("select-list_hidden"), list.classList.remove("select-list_active"))
        }, _.each(options, function(element) {
            element.addEventListener("click", optionHandler)
        })
    }
});
define("SelectBox/SelectBox", ["common/SelectBox"], function(selectBox) {
    return function(model) {
        selectBox(model)
    }
});
define("Tabs/Tabs", function() {
    var Tabs = function() {
        function Tabs(menu) {
            this.menu = menu || [], this.dictionary = {}, this.subdictionary = {},
                function(obj) {
                    for (var j, item, i = menu.length; i--;)
                        if (item = menu[i], obj.dictionary[item.href] = item.label, item.sub)
                            for (j = item.sub.length; j--;) obj.dictionary[item.sub[j].href] = item.label, obj.subdictionary[item.sub[j].href] = item.sub[j].label
                }(this)
        }
        return Tabs.prototype.getParentLbl = function(hash) {
            return this.dictionary[hash]
        }, Tabs.prototype.getChildLbl = function(hash) {
            return this.subdictionary[hash]
        }, Tabs
    }();
    return function(menu) {
        var i, tabs = new Tabs(menu),
            doc = document,
            items = doc.getElementsByClassName("tabs-nav__item"),
            subitems = doc.getElementsByClassName("tabs-sub__item"),
            submenus = doc.getElementsByClassName("tabs-sub-container");

        function setActive(current, els, style) {
            for (i = els.length; i--;) els[i].classList.remove(style), els[i].getAttribute("data-label") === current && els[i].classList.add(style)
        }
        window.addEventListener("hashchange", function() {
                var activeLbl = tabs.getParentLbl(this.location.hash),
                    activeSubLbl = tabs.getChildLbl(this.location.hash);
                setActive(activeLbl, items, "tabs-nav__item_active"), setActive(activeSubLbl, subitems, "tabs-sub__item_active"), setActive(activeLbl, submenus, "tabs-sub-container_active")
            }),
            function() {
                if (!menu || !menu.length) throw new Error("Wrong json model.");
                var event;
                doc.location.hash ? ((event = doc.createEvent("Event")).initEvent("hashchange", !0, !1), doc.documentElement.dispatchEvent(event)) : doc.location.hash = menu[0].href
            }()
    }
});
define("Textarea/Textarea", function() {
    return function(id) {
        id = id.id;
        document.getElementById(id).addEventListener("input", function() {
            var length = this.maxLength,
                value = this.value.replace(/(\r\n|\n|\r)/gm, "\r\n"),
                position = this.selectionStart,
                step = position - 1;
            if (length && value.length > length) {
                for (var difference = 1, i = 0; i < value.length && !(step <= i); i++) "\r" === value[i] && (position++, difference++, step++);
                value = "\r" === value[position - 1] ? value.slice(0, position - 1) + value.slice(position + 1, value.length) : value.slice(0, position - 1) + value.slice(position, value.length), position -= difference
            }
            this.value = value, this.selectionStart = this.selectionEnd = position
        })
    }
});
define("UniversalSelect/UniversalSelect", function() {
    return function(options) {
        var mouseOnList, options = options.id,
            doc = document,
            wrapper = doc.getElementById(options),
            text = wrapper.getElementsByClassName("universal-select__text")[0],
            defaultText = text.innerHTML,
            select = wrapper.getElementsByClassName("select")[0],
            list = wrapper.getElementsByClassName("universal-select-list")[0],
            options = list.getElementsByClassName("universal-select-list__item"),
            selectedValueInput = wrapper.getElementsByClassName("select-value")[0],
            wrappedContent = wrapper.getElementsByClassName("universal-select__wrapper")[0],
            checkIfNeedScroll = function() {
                var distanceToBottom = window.innerHeight - list.getBoundingClientRect().top - 20;
                list.style.maxHeight = distanceToBottom + "px", list.style.overflowY = "auto"
            },
            optionHandler = function() {
                var selectedItemClass = "universal-select-list__item_selected";
                list.classList.remove("universal-select-list_active"), text.innerHTML = this.innerHTML;
                var value = this.getAttribute("data-value");
                selectedValueInput.value = value, selectedValueInput.dispatchEvent(new CustomEvent("change")), select.querySelectorAll('option[value="' + value + '"]')[0].setAttribute("selected", "selected");
                var previouslySelectedItem = this.parentNode.querySelector("." + selectedItemClass);
                previouslySelectedItem && previouslySelectedItem.classList.remove(selectedItemClass), this.classList.add(selectedItemClass), wrapper.change && wrapper.change(this, value)
            },
            listItemsBuilder = function(objects, valueField, textField) {
                valueField = valueField || "value", textField = textField || "text";
                var fragment = doc.createDocumentFragment();
                return _.each(objects, function(item) {
                    var li = doc.createElement("li"),
                        liClass = "universal-select-list__item";
                    li.classList.add(liClass), li.setAttribute("data-value", item[valueField]), li.textContent = item[textField], item.inactive && li.classList.add(liClass + "_inactive"), li.addEventListener("mousedown", optionHandler), fragment.appendChild(li)
                }), fragment
            },
            optionsBuilder = function(objects, valueField, textField) {
                valueField = valueField || "value";
                var fragment = doc.createDocumentFragment();
                return _.each(objects, function(item) {
                    var option = doc.createElement("option");
                    option.setAttribute("value", item[valueField]), fragment.appendChild(option)
                }), fragment
            };
        select.addEventListener("click", function(e) {
            e.stopPropagation(), list.classList.toggle("universal-select-list_active"), checkIfNeedScroll(), select.focus()
        }), list.addEventListener("mouseover", function() {
            mouseOnList = !0
        }), list.addEventListener("mouseout", function() {
            mouseOnList = !1
        }), select.addEventListener("blur", function(e) {
            mouseOnList ? (e.preventDefault(), e.stopPropagation(), select.focus()) : list.classList.remove("universal-select-list_active")
        }), wrapper.update = function(i, selectedValue, valueField, textField, defaultText) {
            var firstObject = listItemsBuilder(i, valueField = valueField || "value", textField = textField || "text"),
                optionsFragment = optionsBuilder(i, valueField);
            select.innerHTML = "", select.appendChild(optionsFragment), select.setAttribute("size", i.length), list.innerHTML = "", list.appendChild(firstObject), selectedValueInput.value = selectedValue || "", 0 < i.length ? (select.classList.remove("select_hidden"), list.classList.remove("universal-select-list_hidden"), list.classList.remove("universal-select-list_active"), firstObject = i[0], selectedValueInput.value && ((i = _.find(i, function(o) {
                return o[valueField] == selectedValue
            })) ? firstObject = i : selectedValueInput.value = ""), text.innerHTML = firstObject[textField], selectedValueInput.value = firstObject[valueField]) : (text.innerHTML = defaultText || "", selectedValueInput.value = null), defaultText && selectedValueInput.value != selectedValue && (text.innerHTML = defaultText, selectedValueInput.value = "", selectedValueInput.dispatchEvent(new CustomEvent("change")))
        }, wrapper.hideOptionsExceptValues = function(values) {
            list.querySelectorAll(".universal-select-list__item").forEach(function(option) {
                var value = option.getAttribute("data-value");
                null != values && values.includes(value) ? option.style.display = "block" : option.style.display = "none"
            })
        }, wrapper.selectOptionByValue = function(value) {
            text.innerHTML = list.querySelector(".universal-select-list__item[data-value=" + value + "]").innerHTML, selectedValueInput.value = value, selectedValueInput.dispatchEvent(new CustomEvent("change"))
        }, wrapper.dropToDefault = function() {
            text.innerHTML = defaultText, selectedValueInput.value = "", selectedValueInput.dispatchEvent(new CustomEvent("change"))
        }, wrapper.markInvalid = function() {
            wrappedContent && !wrappedContent.classList.contains("universal-select__wrapper_invalid") && wrappedContent.classList.add("universal-select__wrapper_invalid")
        }, wrapper.clearInvalid = function() {
            wrappedContent && wrappedContent.classList.contains("universal-select__wrapper_invalid") && wrappedContent.classList.remove("universal-select__wrapper_invalid")
        }, wrapper.getSelectName = function() {
            return selectedValueInput.name
        }, wrapper.getSelectValue = function() {
            return selectedValueInput.value
        }, wrapper.toggleNativeInput = function(enable) {
            enable ? selectedValueInput.removeAttribute("disabled") : selectedValueInput.setAttribute("disabled", "true")
        }, wrapper.enable = function() {
            wrapper.classList.toggle("universal-select_disabled", !1), wrapper.toggleNativeInput(!0)
        }, wrapper.disable = function() {
            wrapper.classList.toggle("universal-select_disabled", !0), wrapper.toggleNativeInput(!1)
        }, _.each(options, function(element) {
            element.addEventListener("mousedown", optionHandler)
        })
    }
});
define("UniversalSelect/UniversalSelect_to-data-url", function() {
    return function(wrapper) {
        var mouseOnSelect, wrapper = wrapper.id,
            wrapper = document.getElementById(wrapper),
            select = wrapper.getElementsByClassName("universal-select__wrapper")[0],
            list = wrapper.getElementsByClassName("universal-select-list")[0],
            options = list.getElementsByClassName("universal-select-list__item"),
            optionHandler = function() {
                var url = this.getAttribute("data-url");
                list.classList.remove("select-list_active"), document.location.href = url
            };
        select.addEventListener("click", function() {
            list.classList.toggle("universal-select-list_active"), select.focus()
        }), select.addEventListener("mouseover", function(e) {
            mouseOnSelect = !0
        }), select.addEventListener("mouseout", function(e) {
            mouseOnSelect = !1
        }), select.addEventListener("blur", function(e) {
            mouseOnSelect ? (e.preventDefault(), e.stopPropagation(), select.focus()) : list.classList.remove("universal-select-list_active")
        });
        for (var i = 0; i < options.length; i++) options[i].addEventListener("click", optionHandler)
    }
});
define("YandexMap/YandexMap", function() {
    return function(model) {
        var tag = document.getElementsByClassName("yandex-map")[0],
            readyStateFlag = !1,
            createdScriptElement = document.createElement("script");
        createdScriptElement.type = "text/javascript", createdScriptElement.src = "https://api-maps.yandex.ru/2.1/?lang=" + model.mapLanguage, createdScriptElement.onload = createdScriptElement.onreadystatechange = function() {
            readyStateFlag || this.readyState && "complete" !== this.readyState || (readyStateFlag = !0, ymaps.ready(function() {
                var placemark, map = new ymaps.Map(tag, {
                    center: [model.placemarkX, model.placemarkY + .01],
                    zoom: model.zoom,
                    controls: ["zoomControl", "fullscreenControl", "rulerControl"]
                });
                model.placemarkX && model.placemarkY && (placemark = new ymaps.Placemark([model.placemarkX, model.placemarkY], {}, model.customPin ? {
                    iconLayout: "default#image",
                    iconImageHref: model.pinImageSrc,
                    iconImageSize: [42, 56]
                } : {}), map.geoObjects.add(placemark))
            }))
        }, document.getElementsByTagName("script")[0].parentNode.appendChild(createdScriptElement)
    }
});
define("BlueCheckbox/BlueCheckbox", function() {
    return function(model) {
        var input = document.getElementById(model.id).querySelector('input[type="checkbox"]');
        model.redirectTo && input.addEventListener("change", function() {
            window.location.href = model.redirectTo
        })
    }
});
define("BlueCheckbox/BlueCheckbox_switch-user-current-progress-mode", ["common/dnevnik", "dialogs/dialogs"], function() {
    return function(model) {
        var oldChecked, dialogs = dnevnik.dialogs,
            input = document.getElementById(model.id).querySelector('input[type="checkbox"]');
        model.options.switchUrl && (oldChecked = input.checked, input.addEventListener("change", function() {
            $.ajax({
                type: "POST",
                url: model.options.switchUrl,
                crossDomain: !0,
                xhrFields: {
                    withCredentials: !0
                },
                dataType: "json",
                data: {
                    alwaysDnevnik: input.checked
                },
                success: function(data) {
                    !0 === data.hasError ? (input.checked = oldChecked, dialogs.error(data.error)) : input.checked = data.alwaysDnevnik
                },
                error: function(xhr, status, error) {
                    input.checked = oldChecked, dnevnik.messageBox.showErrorMsg(error)
                }
            })
        }))
    }
});
define("ChangePassword/ChangePassword", ["../../modules/utils/ajax-request-manager"], function(AjaxManager) {
    new AjaxManager;
    return function(model) {
        var login = model.login,
            reliabilityValue = model.submitClass,
            doc = document,
            firstPassword = doc.querySelector(".input__first-password"),
            secondPassword = doc.querySelector(".input__second-password"),
            firstPasswordHint = doc.querySelector(".yellow-hint_first-password"),
            secondPasswordHint = doc.querySelector(".yellow-hint_second-password"),
            reliability = doc.querySelectorAll(".change-password__password-reliability__line"),
            text = doc.querySelector(".change-password__password-reliability__text"),
            submitButton = doc.getElementsByClassName(reliabilityValue)[0],
            isStaff = model.isStaff,
            isStrongValidationEnable = model.isStrongValidationEnable,
            reliabilityValue = model.reliability,
            resources = model.resources,
            lenConstants = model.validation.lenConstants,
            cyrillicValidatorPattern = new RegExp(model.validation.cyrillicValidatorPattern),
            passwordSymbolsValidatorPattern = new RegExp(model.validation.passwordSymbolsValidatorPattern),
            unreliable2RegexCapital = new RegExp(model.validation.strengthPatterns.unreliable2RegexCapital),
            unreliable2RegexNoncapital = new RegExp(model.validation.strengthPatterns.unreliable2RegexNoncapital),
            unreliable2RegexCapiatalAndNoncapital = new RegExp(model.validation.strengthPatterns.unreliable2RegexCapiatalAndNoncapital),
            unreliable2RegexSymbolsOnly = new RegExp(model.validation.strengthPatterns.unreliable2RegexSymbolsOnly),
            unreliable2RegexNumbersOnly = new RegExp(model.validation.strengthPatterns.unreliable2RegexNumbersOnly),
            goodRegexCapitalAndNumbers = new RegExp(model.validation.strengthPatterns.goodRegexCapitalAndNumbers),
            goodRegexNoncapitalAndNumbers = new RegExp(model.validation.strengthPatterns.goodRegexNoncapitalAndNumbers),
            goodRegexNoncapitalAndSymbols = new RegExp(model.validation.strengthPatterns.goodRegexNoncapitalAndSymbols),
            goodRegexCapitalAndSymbols = new RegExp(model.validation.strengthPatterns.goodRegexCapitalAndSymbols),
            necessaryCapital = new RegExp(model.validation.passwordNecessarySymbolsValidator.capital),
            necessaryNoncapital = new RegExp(model.validation.passwordNecessarySymbolsValidator.noncapital),
            necessaryCapitalAndNonCapital = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalAndNoncapital),
            necessarySymbolsOnly = new RegExp(model.validation.passwordNecessarySymbolsValidator.symbolsOnly),
            necessaryNumbersOnly = new RegExp(model.validation.passwordNecessarySymbolsValidator.numbersOnly),
            necessaryNoncapitalAndNumbers = new RegExp(model.validation.passwordNecessarySymbolsValidator.noncapitalAndNumbers),
            necessaryNoncapitalAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.noncapitalAndSymbols),
            necessaryNoncapitalNumbersAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.noncapitalNumbersAndSymbols),
            necessaryCapitalAndNumbers = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalAndNumbers),
            necessaryCapitalAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalAndSymbols),
            necessaryCapitalNumbersAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalNumbersAndSymbols),
            necessaryNumbersAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.numbersAndSymbols),
            necessaryCapitalNoncapitalAndSymbols = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalNoncapitalAndSymbols),
            necessaryCapitalNoncapitalAndNumbers = new RegExp(model.validation.passwordNecessarySymbolsValidator.capitalNoncapitalAndNumbers),
            recommendationAtLeastTwoCapitals = new RegExp(model.validation.strongStrengthPatterns.atLeastTwoCapitals),
            recommendationAtLeastTwoSymbols = new RegExp(model.validation.strongStrengthPatterns.atLeastTwoSymbols);
        submitButton.addEventListener("click", function() {
            submitButton.setAttribute("disabled", "disabled"), document.forms[0].submit()
        });

        function resetView() {
            secondPassword.classList.remove("input_correctly");
            for (var i = 0, l = reliability.length; i < l; i += 1) reliability[i].classList.remove("change-password__password-reliability__line_red", "change-password__password-reliability__line_yellow", "change-password__password-reliability__line_green")
        }

        function setReliability(rel) {
            if (rel) {
                var reliabilityClass = "";
                switch (rel) {
                    case 1:
                    case 2:
                        reliabilityClass = "change-password__password-reliability__line_red";
                        break;
                    case 3:
                    case 4:
                        reliabilityClass = "change-password__password-reliability__line_yellow";
                        break;
                    case 5:
                        reliabilityClass = "change-password__password-reliability__line_green"
                }
                for (var i = 0, l = rel; i < l; i += 1) reliability[i].classList.add(reliabilityClass)
            }
        }

        function updateView(data) {
            resetView(), firstPasswordHint.classList.add("yellow-hint_hidden"), secondPasswordHint.classList.add("yellow-hint_hidden"), data.SecondPassword && secondPassword.classList.add("input_correctly"), data.FirstPasswordHint && (firstPasswordHint.classList.remove("yellow-hint_hidden"), firstPasswordHint.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = data.FirstPasswordHint), data.SecondPasswordHint && (secondPasswordHint.classList.remove("yellow-hint_hidden"), secondPasswordHint.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = data.SecondPasswordHint), setReliability(data.Reliability), data.Recomendation ? text.textContent = data.Recomendation : text.textContent = ""
        }

        function validatePass(trimmedPas, isStaff, isStrongValidationEnable, login) {
            var result = {
                FirstPassword: !0,
                SecondPassword: !1
            };
            return trimmedPas ? cyrillicValidatorPattern.test(trimmedPas) ? (result.FirstPasswordHint = resources.rootPasswordValidationLatinonly, result) : passwordSymbolsValidatorPattern.test(trimmedPas) ? isStaff && trimmedPas.length < lenConstants.systemMinLength ? (isStrongValidationEnable ? (result.FirstPasswordHint = resources.rootPasswordValidationSystemStrongShortformat, result.Reliability = 2) : result.FirstPasswordHint = resources.rootPasswordValidationSystemShortformat, result) : trimmedPas.length < lenConstants.minLength ? (result.FirstPasswordHint = resources.rootPasswordValidationShortformat, result) : trimmedPas.length > lenConstants.maxLength ? (result.FirstPasswordHint = resources.rootPasswordValidationLongformat, result) : login.toUpperCase() === trimmedPas.toUpperCase() ? (result.FirstPasswordHint = resources.rootPasswordValidationCreatenew, result) : isStrongValidationEnable ? function(trimmedPas) {
                var result = {
                    FirstPassword: !0,
                    SecondPassword: !1,
                    Reliability: 2
                };
                return necessaryCapital.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapital, result) : necessaryNoncapital.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNoncapital, result) : necessaryCapitalAndNonCapital.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalAndNoncapital, result) : necessarySymbolsOnly.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationSymbolsOnly, result) : necessaryNumbersOnly.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNumbersOnly, result) : necessaryNoncapitalAndNumbers.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNoncapitalAndNumbers, result) : necessaryNoncapitalAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNoncapitalAndSymbols, result) : necessaryNoncapitalNumbersAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNoncapitalNumbersAndSymbols, result) : necessaryCapitalAndNumbers.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalAndNumbers, result) : necessaryCapitalAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalAndSymbols, result) : necessaryCapitalNumbersAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalNumbersAndSymbols, result) : necessaryNumbersAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationNumbersAndSymbols, result) : necessaryCapitalNoncapitalAndNumbers.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalNoncapitalAndNumbers, result) : necessaryCapitalNoncapitalAndSymbols.test(trimmedPas) ? (result.FirstPasswordHint = resources.errorStrongValidationCapitalNoncapitalAndSymbols, result) : null
            }(trimmedPas) : null : (result.FirstPasswordHint = resources.rootPasswordValidationDisallowedsymbols, result) : (result.FirstPasswordHint = resources.rootPasswordValidationEmpty, result)
        }

        function checkPasswordOnClient() {
            var password, repeatedPassword, strength = firstPassword.value.trim(),
                result = validatePass(strength, isStaff, isStrongValidationEnable, login);
            result ? updateView(result) : ((strength = isStrongValidationEnable ? (password = strength, repeatedPassword = secondPassword.value.trim(), result = {
                FirstPassword: !0,
                SecondPassword: !1,
                Reliability: 4
            }, recommendationAtLeastTwoCapitals.test(password) && recommendationAtLeastTwoSymbols.test(password) && password.length === lenConstants.recommendedLength - 1 ? result.FirstPasswordHint = resources.recommendationAddOneLetter : !recommendationAtLeastTwoCapitals.test(password) && recommendationAtLeastTwoSymbols.test(password) ? result.FirstPasswordHint = resources.recommendationAddCapital : recommendationAtLeastTwoCapitals.test(password) && !recommendationAtLeastTwoSymbols.test(password) ? result.FirstPasswordHint = resources.recommendationAddSymbol : recommendationAtLeastTwoCapitals.test(password) && !recommendationAtLeastTwoSymbols.test(password) && password.length === lenConstants.recommendedLength - 2 ? result.FirstPasswordHint = resources.recommendationAddSymbolAndOneLetter : !recommendationAtLeastTwoCapitals.test(password) && recommendationAtLeastTwoSymbols.test(password) && password.length === lenConstants.recommendedLength - 2 ? result.FirstPasswordHint = resources.recommendationAddCapitalAndOneLetter : recommendationAtLeastTwoCapitals.test(password) && recommendationAtLeastTwoSymbols.test(password) && password.length === lenConstants.recommendedLength - 2 ? result.FirstPasswordHint = resources.recommendationAddTwoLetters : recommendationAtLeastTwoCapitals.test(password) || recommendationAtLeastTwoSymbols.test(password) ? (result.Reliability = 5, repeatedPassword ? password !== repeatedPassword ? result.SecondPasswordHint = resources.rootPasswordValidationNomatch : result.SecondPassword = !0 : result.FirstPassword = !1) : result.FirstPasswordHint = resources.recommendationAddCapitalAndSymbol, result) : function(password, repeatedPassword) {
                var result = {
                    FirstPassword: !0,
                    SecondPassword: !1
                };
                return unreliable2RegexCapital.test(password) || unreliable2RegexNoncapital.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationUnreliableonlyletters, result.Reliability = 2) : unreliable2RegexCapiatalAndNoncapital.test(password) ? (result.Reliability = 2, result.FirstPasswordHint = resources.rootPasswordValidationUnreliableonlyletters2) : unreliable2RegexNumbersOnly.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationUnreliableonlynumbers, result.Reliability = 2) : unreliable2RegexSymbolsOnly.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationUnreliableonlysymbols, result.Reliability = 2) : goodRegexCapitalAndNumbers.test(password) || goodRegexNoncapitalAndNumbers.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationGoodOnlylettersAndNumbers, result.Reliability = 4) : goodRegexCapitalAndSymbols.test(password) || goodRegexNoncapitalAndSymbols.test(password) ? (result.FirstPasswordHint = resources.rootPasswordValidationGoodOnlylettersAndSymbols, result.Reliability = 4) : (result.Reliability = 5, repeatedPassword ? password !== repeatedPassword ? result.SecondPasswordHint = resources.rootPasswordValidationNomatch : result.SecondPassword = !0 : result.FirstPassword = !1), result
            }(strength, secondPassword.value.trim())).Recomendation = function(strength) {
                return 1 === strength.Reliability || 2 === strength.Reliability || 3 === strength.Reliability ? resources.errorUserPasswordCheckStrengthBad : 4 === strength.Reliability ? resources.errorUserPasswordCheckStrengthGood : 5 === strength.Reliability ? resources.errorUserPasswordCheckStrengthExcellent : ""
            }(strength), updateView(strength))
        }
        resetView(), firstPassword.addEventListener("input", function() {
            checkPasswordOnClient()
        }, !1), secondPassword.addEventListener("input", function() {
            checkPasswordOnClient()
        }, !1), reliabilityValue && setReliability(reliabilityValue), this.setLogin = function(value) {
            login = value
        }, this.check = function() {
            checkPasswordOnClient()
        }
    }
});
define("Captcha/Captcha", ["controls/captcha"], function(captcha) {
    "use strict";
    return function(model) {
        model.refreshButton = "captcha__button", model.valueField = "captcha__value", model.inputField = "input_captcha-validation", model.imageChild = "captcha__image", captcha(model)
    }
});
define("Checkbox/Checkbox", function() {
    return function(id) {
        var label = document.getElementById(id),
            checkbox = label.getElementsByTagName("input")[0],
            valueInput = label.getElementsByClassName("checkbox-value")[0];
        label.addEventListener("click", function(e) {
            e.preventDefault(), label.classList.contains("checkbox_checked") ? (checkbox.removeAttribute("checked"), label.classList.remove("checkbox_checked"), valueInput.setAttribute("value", "false")) : (checkbox.setAttribute("checked", "checked"), label.classList.add("checkbox_checked"), valueInput.setAttribute("value", "true"))
        })
    }
});
define("DropdownContainer/DropdownContainer", ["blocks/dropdownContainer/dropdownContainer"], function(dropdown) {
    "use strict";
    return function(model) {
        dropdown(model)
    }
});
define("ConfirmationBox/ConfirmationBox", function() {
    "use strict";
    return function(model) {
        var area = document.getElementById(model.generatedId);
        area.querySelector(".button_cancel").addEventListener("click", function() {
            area.classList.add("confirmation-box_disable")
        })
    }
});
define("ConvexRadioButton/ConvexRadioButton", ["utils/domready", "common/pubsub"], function(domReady) {
    "use strict";
    var onRadioBtnClick = function(event) {
        var sameGroupButtons = this.querySelector("input").name,
            sameGroupButtons = document.querySelectorAll('[name="' + sameGroupButtons + '"]');
        [].slice.call(sameGroupButtons).forEach(function(button) {
            button.removeAttribute("checked"), button.parentNode.classList.remove("convex-radiobutton_checked", "convex-radiobutton_grey-bordered")
        }), this.classList.add("convex-radiobutton_checked", "convex-radiobutton_grey-bordered"), dnevnik.pubsub.publish("convex-radio-button-value-changed", this.querySelector("input")), event.preventDefault()
    };
    return domReady(function() {
            [].slice.call(document.querySelectorAll(".convex-radiobutton")).forEach(function(elem) {
                elem.addEventListener("click", onRadioBtnClick)
            })
        }),
        function() {}
});
define("Footer/Footer", ["blocks/footer/footer"], function(footer) {
    return function() {
        footer()
    }
});
define("HintBubble/HintBubble", ["utils/domready"], function(domReady) {
    "use strict";

    function onHintBubbleIconClick() {
        this.closest(".hint-bubble").querySelector(".hint-bubble__content").classList.toggle("hint-bubble__content_active")
    }

    function onDocumentBodyClick(event) {
        event.target.closest(".hint-bubble") || hintBubbles.forEach(function(activeContent) {
            activeContent = activeContent.querySelector(".hint-bubble__content_active");
            activeContent && activeContent.classList.toggle("hint-bubble__content_active")
        })
    }
    var hintBubbles, toArray = [].slice;
    return domReady(function() {
            (hintBubbles = toArray.call(document.querySelectorAll(".hint-bubble"))).forEach(function(hintBubble) {
                hintBubble.querySelector(".hint-bubble__icon").addEventListener("click", onHintBubbleIconClick)
            }), document.body.addEventListener("click", onDocumentBodyClick)
        }),
        function() {}
});
define("Input/Input_money", function() {
    "use strict";
    return function(inputHandler) {
        var inputHandler = inputHandler.id,
            input = document.getElementById(inputHandler),
            lastValue = input.value,
            replacer = function(matches) {
                var newValue = matches.replace(/^0|^\,|[^\d\,]/g, ""),
                    matches = newValue.match(/(\d+[,]?\d{0,2})/g);
                return matches && 0 < matches.length && (newValue = matches[0]), newValue = newValue.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ")
            },
            inputHandler = function() {
                var newValue = (newValue = input.value.replace(".", ",")).replace(" ", ""); - 1 !== lastValue.indexOf(",") && newValue.lastIndexOf(",") !== newValue.indexOf(",") || 8 < newValue.length ? input.value = lastValue : (newValue = replacer(newValue), lastValue = newValue, input.value = newValue)
            };
        input.addEventListener("input", inputHandler)
    }
});
define("Input/Input_name", function() {
    "use strict";
    return function(inputHandler) {
        var inputHandler = inputHandler.id,
            input = document.getElementById(inputHandler),
            replacer = function(value) {
                return value.replace(/^[^A-Za-zА-Яа-я`\-\s]/g, "")
            },
            inputHandler = function() {
                var replacedValue = input.value,
                    replacedValue = replacer(replacedValue);
                input.value = replacedValue
            };
        input.addEventListener("input", inputHandler)
    }
});
define("Input/Input_number", function() {
    "use strict";
    return function(max) {
        var id = max.generatedId,
            min = max.minValue && 1 === max.maxLength ? max.minValue : 0,
            max = max.maxValue ? max.maxValue : 9,
            input = document.getElementById(id),
            pattern = new RegExp("[^{0}-{1}+]".replace("{0}", min).replace("{1}", max));
        input.oninput = function() {
            var value = input.value;
            input.value = value.replace(pattern, "")
        }
    }
});
define("Input/Input_phone", function() {
    "use strict";
    return function(model) {
        var id = model.id,
            input = document.getElementById(id),
            template = model.template || "+7 ( <%= this[0] %><%= this[1] %><%= this[2] %> ) <%= this[3] %><%= this[4] %><%= this[5] %><%= this[6] %><%= this[7] %><%= this[8] %><%= this[9] %>",
            countyCodeLastIndex = template.indexOf("<%= this[0] %>");

        function getCatchedNumbersCount() {
            return input.value.substring(countyCodeLastIndex, input.selectionStart).replace(/\D/g, "").length
        }

        function cutCountryCode(value) {
            return value.substring(countyCodeLastIndex)
        }

        function position(numbers, catchedNumbersCount) {
            numbers = Array.from(cutCountryCode(numbers).matchAll(/[\d]/g)).map(function(x) {
                return x.index
            });
            return input.selectionEnd <= countyCodeLastIndex || 0 === numbers.length ? countyCodeLastIndex : numbers[catchedNumbersCount - 1] + 1 + countyCodeLastIndex
        }

        function cursor(p) {
            input.setSelectionRange(p, p)
        }

        function cursorHandler(e) {
            var catchedNumbersCount = getCatchedNumbersCount();
            cursor(position(e.target.value, catchedNumbersCount))
        }

        function spaces(n) {
            return n = n || model.phoneLength, new Array(n).join(" ")
        }
        return template = _.template(template), 0 === input.value.length && input.setAttribute("value", template.call(spaces())), input.addEventListener("focus", cursorHandler), input.addEventListener("click", cursorHandler), input.addEventListener("keydown", cursorHandler), input.addEventListener("input", function(e) {
            var newValue = cutCountryCode(input.value).replace(/\D/g, ""),
                pos = getCatchedNumbersCount(),
                newValue = newValue.length > model.phoneLength ? template.call(newValue.substring(0, model.phoneLength)) : template.call(newValue.concat(spaces(model.phoneLength - newValue.length))),
                pos = pos > model.phoneLength ? newValue.length : position(newValue, pos);
            input.value = newValue, cursor(pos)
        }), {
            clear: function() {
                input.value = template.call(spaces())
            }
        }
    }
});
define("LikeAndShare/LikeAndShare", function() {
    var Likes = function() {
        function Likes() {
            this.requests = {}, this.callbacks = {}, this.windows = {}
        }
        return Likes.prototype.register = function(settings) {
            this.requests[settings.type] = {
                url: settings.requestUrl,
                dataType: settings.dataType
            }, this.callbacks[settings.type] = settings.callback, this.windows[settings.type] = {
                url: settings.windowUrl,
                width: settings.windowParameters.width,
                height: settings.windowParameters.height
            }, settings.init && settings.init()
        }, Likes.prototype.makeRequest = function(callback) {
            var like = this.requests[callback],
                callback = this.callbacks[callback];
            like.url && $.ajax({
                url: like.url,
                dataType: "jsonp",
                type: "GET",
                success: callback
            })
        }, Likes.prototype.popup = function(item) {
            var p, self = this,
                item = this.windows[item],
                parametersString = "",
                params = {
                    width: item.width,
                    height: item.height,
                    left: Math.round(screen.width / 2 - item.width / 2),
                    top: screen.height > item.height ? Math.round(screen.height / 3 - item.height / 2) : 0,
                    personalbar: 0,
                    toolbar: 0,
                    scrollbars: 1,
                    resizable: 1
                };
            for (p in params) parametersString += p + "=" + params[p] + ",";
            var timer, win = window.open(item.url, null, parametersString);
            win ? (win.focus(), timer = setInterval(function() {
                win.closed && (clearInterval(timer), self.refresh())
            }, 1e3)) : location.href = item.url
        }, Likes.prototype.refresh = function() {
            for (var r in this.requests) this.makeRequest(r)
        }, Likes
    }();
    return function(model) {
        function getCounter(type) {
            return doc.getElementsByClassName("likes__counter_" + type)[0]
        }
        var i, length, likes = new Likes,
            doc = document,
            url = doc.URL,
            protocol = location.protocol,
            links = doc.getElementsByClassName("likes__icon"),
            vkCounter = getCounter("vk");
        vkCounter && likes.register({
            type: "vk",
            requestUrl: "//vk.com/share.php?act=count&index=1&url=" + encodeURIComponent(url),
            init: function() {
                window.VK || (window.VK = {}), window.VK.Share = {
                    count: function(idx, number) {
                        vkCounter.innerHTML = number
                    }
                }
            },
            windowUrl: protocol + "//vk.com/share.php?url=" + encodeURIComponent(url) + "&image=" + encodeURI(model.imageUrl) + "&title=" + encodeURIComponent(model.title) + "&description=" + encodeURIComponent(model.description),
            windowParameters: {
                height: 550,
                width: 330
            }
        });
        var okCounter = getCounter("ok");
        okCounter && likes.register({
            type: "ok",
            callback: function(response) {
                response && response.count && (okCounter.innerHTML = response.count)
            },
            windowUrl: protocol + "//www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl=" + encodeURI(url),
            windowParameters: {
                width: 550,
                height: 360
            }
        });
        var mailCounter = getCounter("mail");
        mailCounter && likes.register({
            type: "mail",
            requestUrl: "//connect.mail.ru/share_count?url_list=" + encodeURIComponent(url) + "&callback=1&func=?",
            callback: function(response) {
                response && response[url] && (mailCounter.innerHTML = response[url].shares)
            },
            windowUrl: protocol + "//connect.mail.ru/share?share_url=" + encodeURIComponent(url) + "&title=" + model.title + "&description=" + model.description + "&image_url=" + encodeURI(model.imageUrl),
            windowParameters: {
                width: 550,
                height: 360
            }
        });
        var fbCounter = getCounter("fb");
        for (fbCounter && likes.register({
                type: "fb",
                requestUrl: "//graph.facebook.com/?id=" + url,
                callback: function(response) {
                    response && response.shares && (fbCounter.innerHTML = response.shares)
                },
                windowUrl: protocol + "//www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url),
                windowParameters: {
                    width: 600,
                    height: 500
                }
            }), i = 0, length = links.length; i < length; i += 1) links[i].addEventListener("click", function() {
            likes.popup(this.getAttribute("data-like"))
        }, !1);
        likes.refresh()
    }
});
define("LinesBothSides/LinesBothSides", function() {
    return function() {
        this.render = function(model) {
            document.getElementsByClassName("lines-both-sides__title__text")[0].innerHTML = model
        }
    }
});
define("LocalizationSelect/LocalizationSelect", ["blocks/localizationSelect/localizationSelect"], function(select) {
    return function(model) {
        select(model)
    }
});
define("LocationAutocomplete/LocationAutocomplete", function() {
    return function(doc) {
        function change(e) {
            block.change && block.change(e)
        }

        function setSelectedCity(dataId) {
            selectedCity.setAttribute("value", dataId)
        }

        function resetDistricts() {
            districts.reset(), districtsInput.value = districtsSelectedQuery.value = "", districtsInput.placeholder = districtsText.textContent = districtsDefaultText
        }
        var id = doc.id,
            cityWrapper = doc.citiesId,
            districtsId = doc.districtsId,
            districtsDefaultText = doc.districtsDefaultText,
            citiesDefaultText = doc.citiesDefaultText,
            doc = document,
            block = doc.getElementById(id),
            cities = doc.getElementById(cityWrapper),
            cityWrapper = block.getElementsByClassName("location-autocomplete__wrapper")[0],
            cityInput = cityWrapper.getElementsByClassName("select-box__input-wrapper__block-for-input__input")[0],
            cityText = cityWrapper.getElementsByClassName("select-box__default-text")[0],
            districtsWrapper = block.getElementsByClassName("location-autocomplete__wrapper_districts")[0],
            districtsInput = districtsWrapper.getElementsByClassName("select-box__input-wrapper__block-for-input__input")[0],
            districtsText = districtsWrapper.getElementsByClassName("select-box__default-text")[0],
            districtsSelectedQuery = districtsWrapper.getElementsByClassName("select-box__selected-query")[0],
            districts = doc.getElementById(districtsId),
            selectedCity = block.getElementsByClassName("location-autocomplete__value")[0];
        cities.onItemChanged = function(e) {
            var event, link, dataId;
            e && (e.preventDefault(), event = (dataId = e.target).getAttribute("data-event"), link = dataId.getAttribute("href"), dataId = dataId.getAttribute("data-id"), "event" === event ? (districtsWrapper.classList.remove("location-autocomplete__wrapper_hidden"), resetDistricts(), districts.changeUrl(link), districts.load("", !0), change(), setSelectedCity(dataId)) : (districtsWrapper.classList.add("location-autocomplete__wrapper_hidden"), districts.reset(), null === dataId ? change() : (setSelectedCity(dataId), change(e))))
        }, districts.onItemChanged = function(e) {
            var dataId;
            e && (change(e), null === (dataId = e.target.getAttribute("data-id")) ? (resetDistricts(), change()) : (setSelectedCity(dataId), change(e)))
        }, cities.onAnotherClicked = function() {
            cities.reset(), cityInput.value = "", cityInput.placeholder = cityText.textContent = citiesDefaultText, resetDistricts(), districtsWrapper.classList.add("location-autocomplete__wrapper_hidden"), setSelectedCity(0)
        }
    }
});
define("Notification/Notification", function() {
    "use strict";
    var changesSavedMessage;
    return function(model) {
        var self = this,
            notificationDiv = document.querySelector(".reports-notification");
        model && (changesSavedMessage = model.changesSavedMessage);
        self.show = function(errorList) {
            errorList && 0 < errorList.length ? (notificationDiv.innerHTML = "", notificationDiv.classList.add("reports-notification_error"), errorList.forEach(function(item) {
                notificationDiv.innerHTML += "<span>" + item + "</span><br />"
            })) : (notificationDiv.classList.remove("reports-notification_error"), notificationDiv.innerHTML = changesSavedMessage), notificationDiv.classList.add("reports-notification_active")
        }, self.hide = function() {
            notificationDiv.classList.remove("reports-notification_active")
        }, notificationDiv.addEventListener("click", function(e) {
            e.stopPropagation(), e.target.classList.contains("reports-notification_active") && self.hide()
        }, !1)
    }
});
define("MosregSidebar/MosregSidebar", function() {
    "use strict";
    return function() {
        var submenuTriggerBtn = document.querySelector(".mosreg-submenu-button"),
            submenuList = document.querySelector(".mosreg-submenu-list"),
            submenuIcon = document.querySelector(".mosreg-submenu-button__icon");
        submenuTriggerBtn && submenuTriggerBtn.addEventListener("click", function() {
            submenuList.classList.toggle("mosreg-submenu-list_active"), submenuIcon.classList.toggle("mosreg-submenu-button__icon_active")
        })
    }
});
define("NewCalendar/NewCalendar", ["NewCalendar/NewCalendar_Utils"], function(calendarUtils) {
    return function(model) {
        model.isFixed ? calendarUtils.initFixed(document.getElementById(model.generatedId), model.months, model.monthsShort, model.fromDateString, model.toDateString, model.defaultDateString) : calendarUtils.init(document.getElementById(model.generatedId), model.months, model.monthsShort, model.fromDateString, model.toDateString, model.defaultDateString)
    }
});
define("NewCalendar/NewCalendar_Utils", ["utils/dispatchevent"], function(eventDispatcher) {
    function init(element, months, monthsShort, fromDate, toDate, defaultDate) {
        $(element).calendar({
            months: months,
            months_short: monthsShort,
            showTodayButton: !1,
            containerClass: "new-calendar",
            monthYearTemplate: "{month} {year}",
            fromDate: fromDate,
            toDate: toDate,
            defaultDate: defaultDate || null,
            onDateSelected: function(e) {
                eventDispatcher.call(null, "change", element)
            }
        })
    }
    return {
        init: init,
        initFixed: function(element, months, monthsShort, fromDate, toDate, defaultDate) {
            init(element, months, monthsShort, fromDate, toDate, defaultDate), $(element).focus(function() {
                var self = $(this),
                    timer = setInterval(function() {
                        clearInterval(timer);
                        self.parent("div");
                        $(".new-calendar").css({
                            position: "fixed",
                            top: self.offset().top - $(document).scrollTop() + 40
                        })
                    }, 3)
            })
        }
    }
});
define("Popup/Popup", function() {
    "use strict";
    return function(model) {
        var popup = document.querySelector('div[data-popup-id="' + model.id + '"]');
        this.getPopup = function() {
            return popup
        };
        var overlay, originalPosition = document.body.style.overflow,
            show = this.showPopup = function() {
                popup.setAttribute("data-meta-originalOverflow", document.body.style.overflow), document.body.style.overflow = "hidden", popup.classList.add("popup_active")
            },
            hide = this.hidePopup = function(isCancelled, cancellationOnly) {
                document.body.style.overflow = popup.getAttribute("data-meta-originalOverflow") || originalPosition, popup.classList.remove("popup_active"), isCancelled && popup.onCancel && popup.onCancel(), !cancellationOnly && popup.onItemClosed && popup.onItemClosed()
            },
            titleElement = popup.querySelector(".popup__title");
        this.setTitle = function(title) {
            (titleElement.innerText = title) && !popup.classList.contains("popup_with-header") && popup.classList.add("popup_with-header")
        }, this.toggleTitle = function(showTitle) {
            showTitle ? popup.classList.add("popup_with-header") : popup.classList.remove("popup_with-header")
        };
        if (model.openTriggerSelector)
            for (var openTriggers = document.querySelectorAll(model.openTriggerSelector), i = 0; i < openTriggers.length; i++) openTriggers[i].addEventListener("click", function(e) {
                model.openTriggerAction && model.openTriggerAction(e), show()
            });
        model.canExit && (!model.closeTriggerSelector || (overlay = (model.isInnerCloseTrigger ? popup : document).querySelector(model.closeTriggerSelector)) && overlay.addEventListener("click", hide), (overlay = popup.querySelector(".popup__exit")) && overlay.addEventListener("click", hide), (overlay = popup.querySelector("div.popup__overlay")) && overlay.addEventListener("click", hide), document.addEventListener("keydown", function(e) {
            27 === e.keyCode && hide(!0)
        })), model.show && show(), model.show && model.hidePopupAutomatically && setTimeout(hide, 3e3)
    }
});
define("RadioButton/RadioButton", function() {
    return function(labelWithRadio) {
        var doc = document,
            labelWithRadio = doc.getElementById(labelWithRadio.id),
            triggerRadio = function(selectedLabel) {
                for (var selectedRadio = selectedLabel.getElementsByClassName("radio-button__input")[0], radios = doc.getElementsByClassName("radio-button__input"), i = 0; i < radios.length; i++) r = radios[i], r.removeAttribute("checked"), r.parentNode.classList.remove("radio-button_checked");
                selectedLabel.classList.add("radio-button_checked"), selectedRadio.setAttribute("checked", "checked")
            };
        labelWithRadio.addEventListener("click", function(e) {
            this.classList.contains("radio-button_checked") || triggerRadio(this)
        }, !1)
    }
});
define("RadioButtonGroup/RadioButtonGroup", function() {
    "use strict";
    return function(model) {
        for (var ids = model.ids, radios = [], i = 0; i < ids.length; i++) {
            var element = document.getElementById(ids[i]);
            radios[i] = {
                label: element,
                input: element.getElementsByTagName("input")[0]
            }, radios[i].label.addEventListener("click", function(e) {
                ! function(selectedLabel) {
                    if (!selectedLabel.classList.contains("convex-radiobutton_checked") && "disabled" !== selectedLabel.getElementsByTagName("input")[0].getAttribute("disabled")) {
                        for (var i = 0; i < ids.length; i++) radios[i].input.removeAttribute("checked"), radios[i].label.classList.remove("convex-radiobutton_checked");
                        var selectedRadio = selectedLabel.getElementsByTagName("input")[0];
                        selectedLabel.classList.add("convex-radiobutton_checked"), selectedRadio.setAttribute("checked", "checked")
                    }
                }(this)
            }, !1)
        }
    }
});
define("Select/Select", function() {
    return function(options) {
        var optionHandler, listItemsBuilder, optionsBuilder, clickFunction = options.id,
            doc = document,
            wrapper = doc.getElementById(clickFunction),
            text = wrapper.getElementsByClassName("select-wrapper__default-text")[0],
            defaultText = wrapper.getElementsByClassName("select-wrapper__choose-text")[0],
            select = wrapper.getElementsByClassName("select")[0],
            arrow = wrapper.getElementsByClassName("select-wrapper__arrow")[0],
            list = wrapper.getElementsByClassName("select-list")[0],
            options = list.getElementsByClassName("select-list__item"),
            selectedValueInput = wrapper.getElementsByClassName("select-value")[0],
            overlappedInputs = doc.getElementsByClassName("input_element-overlapped-by-select");

        function selectListToggleFunction(show) {
            list.classList.toggle("select-list_active", show), _.each(overlappedInputs, function(item) {
                item.classList.toggle("input_element-overlapped-by-select_invisible", show)
            })
        }
        optionHandler = function() {
            selectListToggleFunction(!1), text.innerHTML = this.innerHTML, text.classList.add("select-wrapper__default-text_color-black");
            var value = this.getAttribute("data-value");
            selectedValueInput.value = value, select.querySelectorAll('option[value="' + value + '"]')[0].setAttribute("selected", "selected"), wrapper.change && wrapper.change(this)
        }, listItemsBuilder = function(objects) {
            var fragment = doc.createDocumentFragment();
            return _.each(objects, function(item) {
                var li = doc.createElement("li");
                li.classList.add("select-list__item"), li.setAttribute("data-value", item.value), li.textContent = item.text, li.addEventListener("click", optionHandler), fragment.appendChild(li)
            }), fragment
        }, optionsBuilder = function(objects) {
            var fragment = doc.createDocumentFragment();
            return _.each(objects, function(item) {
                var option = doc.createElement("option");
                option.setAttribute("value", item.value), fragment.appendChild(option)
            }), fragment
        }, clickFunction = function(e) {
            e.preventDefault(), e.stopPropagation(), selectListToggleFunction(!list.classList.contains("select-list_active")), setTimeout(function() {
                select.blur()
            }, 0)
        };
        select.addEventListener("click", clickFunction), arrow.addEventListener("click", clickFunction), document.addEventListener("click", function(e) {
            for (var target = e.target; target !== document;) {
                if (target === wrapper) return;
                target = target.parentNode
            }
            selectListToggleFunction(!1)
        }, !0), wrapper.update = function(objects) {
            var itemsFragment = listItemsBuilder(objects),
                optionsFragment = optionsBuilder(objects);
            select.innerHTML = "", select.appendChild(optionsFragment), select.setAttribute("size", objects.length), list.innerHTML = "", list.appendChild(itemsFragment), text.innerHTML = defaultText.innerHTML, text.classList.remove("select-wrapper__default-text_color-black"), selectedValueInput.value = "", 0 < objects.length && (select.classList.remove("select_hidden"), list.classList.remove("select-list_hidden"), list.classList.remove("select-list_active"))
        }, _.each(options, function(element) {
            element.addEventListener("click", optionHandler)
        })
    }
});
define("SelectBox/SelectBox", ["common/SelectBox"], function(selectBox) {
    return function(model) {
        selectBox(model)
    }
});
define("Textarea/Textarea", function() {
    return function(id) {
        id = id.id;
        document.getElementById(id).addEventListener("input", function() {
            var length = this.maxLength,
                value = this.value.replace(/(\r\n|\n|\r)/gm, "\r\n"),
                position = this.selectionStart,
                step = position - 1;
            if (length && value.length > length) {
                for (var difference = 1, i = 0; i < value.length && !(step <= i); i++) "\r" === value[i] && (position++, difference++, step++);
                value = "\r" === value[position - 1] ? value.slice(0, position - 1) + value.slice(position + 1, value.length) : value.slice(0, position - 1) + value.slice(position, value.length), position -= difference
            }
            this.value = value, this.selectionStart = this.selectionEnd = position
        })
    }
});
define("Tabs/Tabs", function() {
    var Tabs = function() {
        function Tabs(menu) {
            this.menu = menu || [], this.dictionary = {}, this.subdictionary = {},
                function(obj) {
                    for (var j, item, i = menu.length; i--;)
                        if (item = menu[i], obj.dictionary[item.href] = item.label, item.sub)
                            for (j = item.sub.length; j--;) obj.dictionary[item.sub[j].href] = item.label, obj.subdictionary[item.sub[j].href] = item.sub[j].label
                }(this)
        }
        return Tabs.prototype.getParentLbl = function(hash) {
            return this.dictionary[hash]
        }, Tabs.prototype.getChildLbl = function(hash) {
            return this.subdictionary[hash]
        }, Tabs
    }();
    return function(menu) {
        var i, tabs = new Tabs(menu),
            doc = document,
            items = doc.getElementsByClassName("tabs-nav__item"),
            subitems = doc.getElementsByClassName("tabs-sub__item"),
            submenus = doc.getElementsByClassName("tabs-sub-container");

        function setActive(current, els, style) {
            for (i = els.length; i--;) els[i].classList.remove(style), els[i].getAttribute("data-label") === current && els[i].classList.add(style)
        }
        window.addEventListener("hashchange", function() {
                var activeLbl = tabs.getParentLbl(this.location.hash),
                    activeSubLbl = tabs.getChildLbl(this.location.hash);
                setActive(activeLbl, items, "tabs-nav__item_active"), setActive(activeSubLbl, subitems, "tabs-sub__item_active"), setActive(activeLbl, submenus, "tabs-sub-container_active")
            }),
            function() {
                if (!menu || !menu.length) throw new Error("Wrong json model.");
                var event;
                doc.location.hash ? ((event = doc.createEvent("Event")).initEvent("hashchange", !0, !1), doc.documentElement.dispatchEvent(event)) : doc.location.hash = menu[0].href
            }()
    }
});
define("UnfoldingContainer/UnfoldingContainer", ["utils/domready"], function(domReady) {
    "use strict";
    return domReady(function() {
            var unfoldingContainer = document.getElementsByClassName("unfolding-container");
            [].slice.call(unfoldingContainer).forEach(function(unfoldingContainerContent) {
                var btn, content, unfoldingContainerBtn = unfoldingContainerContent.getElementsByClassName("unfolding-container__button")[0],
                    unfoldingContainerContent = unfoldingContainerContent.getElementsByClassName("unfolding-container__content")[0];
                unfoldingContainerBtn.addEventListener("click", (btn = unfoldingContainerBtn, content = unfoldingContainerContent, function() {
                    btn.classList.toggle("unfolding-container__button_active"), content.classList.toggle("unfolding-container__content_active")
                }))
            })
        }),
        function() {}
});
define("YandexMap/YandexMap", function() {
    return function(model) {
        var tag = document.getElementsByClassName("yandex-map")[0],
            readyStateFlag = !1,
            createdScriptElement = document.createElement("script");
        createdScriptElement.type = "text/javascript", createdScriptElement.src = "https://api-maps.yandex.ru/2.1/?lang=" + model.mapLanguage, createdScriptElement.onload = createdScriptElement.onreadystatechange = function() {
            readyStateFlag || this.readyState && "complete" !== this.readyState || (readyStateFlag = !0, ymaps.ready(function() {
                var placemark, map = new ymaps.Map(tag, {
                    center: [model.placemarkX, model.placemarkY + .01],
                    zoom: model.zoom,
                    controls: ["zoomControl", "fullscreenControl", "rulerControl"]
                });
                model.placemarkX && model.placemarkY && (placemark = new ymaps.Placemark([model.placemarkX, model.placemarkY], {}, model.customPin ? {
                    iconLayout: "default#image",
                    iconImageHref: model.pinImageSrc,
                    iconImageSize: [42, 56]
                } : {}), map.geoObjects.add(placemark))
            }))
        }, document.getElementsByTagName("script")[0].parentNode.appendChild(createdScriptElement)
    }
});
define("UniversalSelect/UniversalSelect", function() {
    return function(options) {
        var mouseOnList, options = options.id,
            doc = document,
            wrapper = doc.getElementById(options),
            text = wrapper.getElementsByClassName("universal-select__text")[0],
            defaultText = text.innerHTML,
            select = wrapper.getElementsByClassName("select")[0],
            list = wrapper.getElementsByClassName("universal-select-list")[0],
            options = list.getElementsByClassName("universal-select-list__item"),
            selectedValueInput = wrapper.getElementsByClassName("select-value")[0],
            wrappedContent = wrapper.getElementsByClassName("universal-select__wrapper")[0],
            checkIfNeedScroll = function() {
                var distanceToBottom = window.innerHeight - list.getBoundingClientRect().top - 20;
                list.style.maxHeight = distanceToBottom + "px", list.style.overflowY = "auto"
            },
            optionHandler = function() {
                var selectedItemClass = "universal-select-list__item_selected";
                list.classList.remove("universal-select-list_active"), text.innerHTML = this.innerHTML;
                var value = this.getAttribute("data-value");
                selectedValueInput.value = value, selectedValueInput.dispatchEvent(new CustomEvent("change")), select.querySelectorAll('option[value="' + value + '"]')[0].setAttribute("selected", "selected");
                var previouslySelectedItem = this.parentNode.querySelector("." + selectedItemClass);
                previouslySelectedItem && previouslySelectedItem.classList.remove(selectedItemClass), this.classList.add(selectedItemClass), wrapper.change && wrapper.change(this, value)
            },
            listItemsBuilder = function(objects, valueField, textField) {
                valueField = valueField || "value", textField = textField || "text";
                var fragment = doc.createDocumentFragment();
                return _.each(objects, function(item) {
                    var li = doc.createElement("li"),
                        liClass = "universal-select-list__item";
                    li.classList.add(liClass), li.setAttribute("data-value", item[valueField]), li.textContent = item[textField], item.inactive && li.classList.add(liClass + "_inactive"), li.addEventListener("mousedown", optionHandler), fragment.appendChild(li)
                }), fragment
            },
            optionsBuilder = function(objects, valueField, textField) {
                valueField = valueField || "value";
                var fragment = doc.createDocumentFragment();
                return _.each(objects, function(item) {
                    var option = doc.createElement("option");
                    option.setAttribute("value", item[valueField]), fragment.appendChild(option)
                }), fragment
            };
        select.addEventListener("click", function(e) {
            e.stopPropagation(), list.classList.toggle("universal-select-list_active"), checkIfNeedScroll(), select.focus()
        }), list.addEventListener("mouseover", function() {
            mouseOnList = !0
        }), list.addEventListener("mouseout", function() {
            mouseOnList = !1
        }), select.addEventListener("blur", function(e) {
            mouseOnList ? (e.preventDefault(), e.stopPropagation(), select.focus()) : list.classList.remove("universal-select-list_active")
        }), wrapper.update = function(i, selectedValue, valueField, textField, defaultText) {
            var firstObject = listItemsBuilder(i, valueField = valueField || "value", textField = textField || "text"),
                optionsFragment = optionsBuilder(i, valueField);
            select.innerHTML = "", select.appendChild(optionsFragment), select.setAttribute("size", i.length), list.innerHTML = "", list.appendChild(firstObject), selectedValueInput.value = selectedValue || "", 0 < i.length ? (select.classList.remove("select_hidden"), list.classList.remove("universal-select-list_hidden"), list.classList.remove("universal-select-list_active"), firstObject = i[0], selectedValueInput.value && ((i = _.find(i, function(o) {
                return o[valueField] == selectedValue
            })) ? firstObject = i : selectedValueInput.value = ""), text.innerHTML = firstObject[textField], selectedValueInput.value = firstObject[valueField]) : (text.innerHTML = defaultText || "", selectedValueInput.value = null), defaultText && selectedValueInput.value != selectedValue && (text.innerHTML = defaultText, selectedValueInput.value = "", selectedValueInput.dispatchEvent(new CustomEvent("change")))
        }, wrapper.hideOptionsExceptValues = function(values) {
            list.querySelectorAll(".universal-select-list__item").forEach(function(option) {
                var value = option.getAttribute("data-value");
                null != values && values.includes(value) ? option.style.display = "block" : option.style.display = "none"
            })
        }, wrapper.selectOptionByValue = function(value) {
            text.innerHTML = list.querySelector(".universal-select-list__item[data-value=" + value + "]").innerHTML, selectedValueInput.value = value, selectedValueInput.dispatchEvent(new CustomEvent("change"))
        }, wrapper.dropToDefault = function() {
            text.innerHTML = defaultText, selectedValueInput.value = "", selectedValueInput.dispatchEvent(new CustomEvent("change"))
        }, wrapper.markInvalid = function() {
            wrappedContent && !wrappedContent.classList.contains("universal-select__wrapper_invalid") && wrappedContent.classList.add("universal-select__wrapper_invalid")
        }, wrapper.clearInvalid = function() {
            wrappedContent && wrappedContent.classList.contains("universal-select__wrapper_invalid") && wrappedContent.classList.remove("universal-select__wrapper_invalid")
        }, wrapper.getSelectName = function() {
            return selectedValueInput.name
        }, wrapper.getSelectValue = function() {
            return selectedValueInput.value
        }, wrapper.toggleNativeInput = function(enable) {
            enable ? selectedValueInput.removeAttribute("disabled") : selectedValueInput.setAttribute("disabled", "true")
        }, wrapper.enable = function() {
            wrapper.classList.toggle("universal-select_disabled", !1), wrapper.toggleNativeInput(!0)
        }, wrapper.disable = function() {
            wrapper.classList.toggle("universal-select_disabled", !0), wrapper.toggleNativeInput(!1)
        }, _.each(options, function(element) {
            element.addEventListener("mousedown", optionHandler)
        })
    }
});
define("UniversalSelect/UniversalSelect_to-data-url", function() {
    return function(wrapper) {
        var mouseOnSelect, wrapper = wrapper.id,
            wrapper = document.getElementById(wrapper),
            select = wrapper.getElementsByClassName("universal-select__wrapper")[0],
            list = wrapper.getElementsByClassName("universal-select-list")[0],
            options = list.getElementsByClassName("universal-select-list__item"),
            optionHandler = function() {
                var url = this.getAttribute("data-url");
                list.classList.remove("select-list_active"), document.location.href = url
            };
        select.addEventListener("click", function() {
            list.classList.toggle("universal-select-list_active"), select.focus()
        }), select.addEventListener("mouseover", function(e) {
            mouseOnSelect = !0
        }), select.addEventListener("mouseout", function(e) {
            mouseOnSelect = !1
        }), select.addEventListener("blur", function(e) {
            mouseOnSelect ? (e.preventDefault(), e.stopPropagation(), select.focus()) : list.classList.remove("universal-select-list_active")
        });
        for (var i = 0; i < options.length; i++) options[i].addEventListener("click", optionHandler)
    }
});
define("CtpCommonConfirmPopup/CtpCommonConfirmPopup", ["CtpPopup/CtpPopup_utils", "utils/template"], function(utils, templater) {
    return function(popup) {
        var popupId = popup.id,
            messageTemplate = popup.messageTemplate,
            popupTitle = popup.popupTitle,
            acceptButtonLabel = popup.acceptButtonLabel,
            rejectButtonLabel = popup.rejectButtonLabel,
            acceptAction = null,
            rejectAction = null,
            popup = document.getElementById(popupId),
            popupTitleElement = popup.querySelector("[name = 'popupTitle']"),
            popupMessageElement = popup.querySelector("[name = 'popupMessage']"),
            acceptButton = popup.querySelector("[name = 'acceptButton']"),
            rejectButton = popup.querySelector("[name = 'rejectButton']");

        function closePopup() {
            utils.closePopup(popupId)
        }

        function acceptButtonAction() {
            closePopup(), "function" == typeof acceptAction && acceptAction.call()
        }

        function rejectButtonAction() {
            closePopup(), "function" == typeof rejectAction && rejectAction.call()
        }
        utils.findContent(popupId, function(content) {
            content.initialize = function(showCb, acceptCallback, rejectCallabck, messageArgs) {
                acceptAction = acceptCallback, rejectAction = rejectCallabck,
                    function(messageArgs) {
                        popupTitleElement.innerHTML = popupTitle, popupMessageElement.innerHTML = messageArgs ? templater(messageTemplate, messageArgs) : messageTemplate, acceptButton.value = acceptButtonLabel, rejectButton.value = rejectButtonLabel, acceptButton.addEventListener("click", acceptButtonAction), rejectButton.addEventListener("click", rejectButtonAction)
                    }(messageArgs), showCb.call()
            }
        })
    }
});
define("CtpCopy/CtpCopy", ["CtpPopup/CtpPopup_utils"], function(utils) {
    "use strict";
    return function(model) {
        var group, subGroup, subject, person, doc = document,
            popupId = model.id,
            warningPopupId = model.warningPopupId,
            currentStudyYear = model.studyYear,
            errorBlock = doc.getElementById("ctp-copy-error-block"),
            subjectWrapper = doc.getElementById(model.subjectsId),
            groupWrapper = doc.getElementById(model.groupsId),
            subGroupWrapper = doc.getElementById(model.subGroupsId),
            saveBtn = (doc.getElementById(model.teachersId), document.getElementById("saveCopyCtpBtn"));

        function formIsValid(showError) {
            errorBlock.innerHTML = "";
            var valid = validateGroup(showError),
                valid = validateSubGroup(showError) && valid;
            return valid = validateSubject(showError) && valid, !valid ? saveBtn.setAttribute("disabled", "disabled") : saveBtn.removeAttribute("disabled"), valid
        }

        function validateSubject(showError) {
            return !subject.value && subject.value <= 0 ? (showError && subjectWrapper.markInvalid(), !1) : (subjectWrapper.clearInvalid(), !0)
        }

        function validateSubGroup(showError) {
            return !subGroup.value || subGroup.value <= 0 ? (showError && subGroupWrapper.markInvalid(), !1) : (subGroupWrapper.clearInvalid(), !0)
        }

        function validateGroup(showError) {
            return !group.value || group.value <= 0 ? (showError && groupWrapper.markInvalid(), !1) : (groupWrapper.clearInvalid(), !0)
        }

        function refreshFormData() {
            var complete, urlParams;
            complete = function() {
                reloadSubGroups(function() {
                    formIsValid(!0)
                })
            }, urlParams = {
                year: currentStudyYear
            }, $.get(model.getGroupsUrl, urlParams, function(result) {
                groupWrapper.update(result), "function" == typeof complete && complete.call()
            }).fail(function() {
                errorBlock.innerHTML = model.generalError
            })
        }

        function reloadSubGroups(complete) {
            var urlParams = "0";
            group.value && (urlParams = group.value);
            urlParams = {
                groupId: urlParams
            };
            $.get(model.getSubGroupsUrl, urlParams, function(result) {
                subGroupWrapper.update(result), "function" == typeof complete && complete.call()
            }).fail(function() {
                errorBlock.innerHTML = model.generalError
            })
        }
        utils.findContent(popupId, function(content) {
            group = content.querySelector('[name="GroupId"]'), subGroup = content.querySelector('[name="SubgroupId"]'), subject = content.querySelector('[name="SubjectId"]'), person = content.querySelector('[name="PersonId"]')
        }), person.addEventListener("change", function() {
            formIsValid(!1)
        }), subject.addEventListener("change", function() {
            validateSubject(!0), formIsValid(!1)
        }), subGroup.addEventListener("change", function() {
            validateSubGroup(!0), formIsValid(!1)
        }), group.addEventListener("change", function() {
            validateGroup(!0), formIsValid(!1)
        }), doc.getElementById("prevYear").addEventListener("click", function() {
            this.classList.contains("button_simple-disabled") || (--currentStudyYear, this.classList.add("button_simple-disabled"), doc.getElementById("nextYear").classList.remove("button_simple-disabled"), doc.getElementById("studyYearText").innerHTML = currentStudyYear + "-" + (currentStudyYear + 1), refreshFormData())
        }), doc.getElementById("nextYear").addEventListener("click", function() {
            this.classList.contains("button_simple-disabled") || (currentStudyYear += 1, this.classList.add("button_simple-disabled"), doc.getElementById("prevYear").classList.remove("button_simple-disabled"), doc.getElementById("studyYearText").innerHTML = currentStudyYear + "-" + (currentStudyYear + 1), refreshFormData())
        }), group.addEventListener("change", function() {
            reloadSubGroups()
        }), saveBtn.addEventListener("click", function() {
            formIsValid(!0) && $.post(model.url, {
                studyYear: currentStudyYear,
                groupId: subGroup.value,
                subjectId: subject.value,
                personId: person.value
            }, function(response) {
                response.redirect ? window.location.href = response.url : (utils.closePopup(popupId), doc.getElementById(warningPopupId).update(response.text, response.url), utils.showPopup(warningPopupId))
            }).fail(function() {
                errorBlock.innerHTML = model.generalError
            })
        })
    }
});
define("CtpConfirmPopup/CtpConfirmPopup", ["CtpPopup/CtpPopup_utils", "utils/template"], function(utils, templater) {
    return function(model) {
        var successCallBack, popupId = model.id,
            titleElement = document.getElementById(popupId).querySelector("[name = 'ctp-confirm-popup-title']"),
            generalError = model.generalError,
            actionUrl = model.actionUrl,
            infoPopupId = model.infoPopupId,
            confirmMessageTemplate = model.confirmMessageTemplate,
            titleTemplate = model.titleTemplate,
            attrData = null;

        function closePopup() {
            utils.closePopup(popupId)
        }

        function showInfoPopup(message) {
            utils.showPopup(infoPopupId, message)
        }

        function switchBtnState(disabled, btn) {
            disabled ? btn.setAttribute("disabled", "disabled") : btn.removeAttribute("disabled")
        }

        function deleteCtp(realActionUrl) {
            var complete, target = realActionUrl.target || realActionUrl.srcElement;
            switchBtnState(!0, target), complete = function() {
                switchBtnState(!1, target)
            }, realActionUrl = templater(decodeURIComponent(actionUrl), attrData), $.post(realActionUrl, function(result) {
                closePopup(), showInfoPopup(result.message), "function" == typeof successCallBack && successCallBack()
            }).fail(function() {
                closePopup(), showInfoPopup(generalError)
            }).done(function() {
                "function" == typeof complete && complete.call()
            })
        }
        utils.findContent(popupId, function(content) {
            content.initialize = function(showCb, deleteBtn, contentPragraph) {
                var ctpData, sourceString;
                attrData = deleteBtn.dataset, successCallBack = contentPragraph, ctpData = attrData, sourceString = confirmMessageTemplate, contentPragraph = (deleteBtn = content).getElementsByTagName("p")[0], sourceString = templater(sourceString = sourceString, ctpData), contentPragraph.innerHTML = sourceString, titleElement.innerHTML = titleTemplate, (deleteBtn = deleteBtn.getElementsByTagName("input")[0]).setAttribute("data-ctpId", ctpData.ctpId), deleteBtn.addEventListener("click", deleteCtp), showCb.call()
            }
        })
    }
});
define("CtpCreate/CtpCreate", ["CtpPopup/CtpPopup_utils"], function(utils) {
    return function(model) {
        "use strict";
        var group, subject, person, hours, dataUri, ctpId, additionalFieldsClass = "blue-checkbox_ctp-additional-fields-value",
            doc = document,
            popupId = model.popupId,
            createTitle = model.createTitle,
            editTitle = model.editTitle,
            subjectWrapper = doc.getElementById(model.subjectsId),
            groupWrapper = doc.getElementById(model.groupsId),
            personWrapper = doc.getElementById(model.teachersId),
            errorBlock = doc.getElementById("cpt-create-error-block"),
            saveBtn = document.getElementById("saveCtpBtn"),
            confirmPopupId = model.confirmPopupId;

        function updateSelect(wrapper, model) {
            wrapper && model && model.Options && wrapper.update(model.Options, model.SelectedValue, "Value", "Text")
        }

        function setTitle(content, title) {
            content.getElementsByClassName("ctp-popup-header__title")[0].getElementsByTagName("span")[0].innerHTML = title
        }

        function getModel() {
            return {
                ctpId: ctpId,
                groupId: group.value,
                subjectId: subject.value,
                personId: person.value,
                hours: hours.value,
                additionalFields: function() {
                    for (var containers = document.getElementsByClassName(additionalFieldsClass), result = 0, i = 0; i < containers.length; i++) {
                        var checkbox = containers[i].getElementsByTagName("input")[0];
                        checkbox && checkbox.checked && (result += +checkbox.value)
                    }
                    return result
                }(),
                checkDuplicates: !0
            }
        }

        function formIsValid(showError) {
            var valid = !(errorBlock.innerHTML = ""),
                valid = validateGroup(showError) && valid;
            return valid = validateSubject(showError) && valid, valid = validatePerson(showError) && valid, switchSaveBtnState(!(valid = validateHours(showError) && valid)), valid
        }

        function validatePerson(showError) {
            return !person.value || 0 === person.value || person.value < -1 ? (showError && personWrapper && personWrapper.markInvalid(), !1) : (personWrapper && personWrapper.clearInvalid(), !0)
        }

        function validateSubject(showError) {
            return !subject.value && subject.value <= 0 ? (showError && subjectWrapper.markInvalid(), !1) : (subjectWrapper.clearInvalid(), !0)
        }

        function validateGroup(showError) {
            return !group.value || group.value <= 0 ? (showError && groupWrapper.markInvalid(), !1) : (groupWrapper.clearInvalid(), !0)
        }

        function validateHours(showError) {
            return !hours.value || hours.value <= 0 ? (showError && hours.classList.add("input_only-for-ctp-error"), !1) : (hours.classList.remove("input_only-for-ctp-error"), !0)
        }

        function switchSaveBtnState(disabled) {
            disabled ? saveBtn.setAttribute("disabled", "disabled") : saveBtn.removeAttribute("disabled")
        }

        function post(complete) {
            formIsValid(!0) ? function postData(model, complete) {
                $.post(dataUri, model, function(result) {
                    result.error ? errorBlock.innerHTML = result.error : !0 === result.showConfirm ? utils.showPopup(confirmPopupId, function() {
                        model.checkDuplicates = !1, postData(model)
                    }, null, result.confirmMessageArgs) : (utils.closePopup(popupId), window.location = result.url)
                }).fail(function() {
                    errorBlock.innerHTML = model.generalError
                }).done(function() {
                    "function" == typeof complete && complete.call()
                })
            }(getModel(), function() {
                "function" == typeof complete && complete.call()
            }) : "function" == typeof complete && complete.call()
        }
        utils.findContent(popupId, function(popupContent) {
            group = popupContent.querySelector('[name="GroupId"]'), subject = popupContent.querySelector('[name="SubjectId"]'), person = popupContent.querySelector('[name="PersonId"]'), hours = popupContent.querySelector('[name="Hours"]'), popupContent.initialize = function(showCb, el) {
                dataUri = el.getAttribute("data-infourl"), $.get(dataUri).done(function(model) {
                    ctpId = model.CtpId, setTitle(popupContent, ctpId ? editTitle : createTitle),
                        function(model) {
                            updateSelect(subjectWrapper, model.Subjects), updateSelect(personWrapper, model.Teachers), updateSelect(groupWrapper, model.Groups), !0 === model.IsPublished ? (subjectWrapper.setAttribute("disabled", "disabled"), groupWrapper.setAttribute("disabled", "disabled")) : (subjectWrapper.removeAttribute("disabled", "disabled"), groupWrapper.removeAttribute("disabled", "disabled")), personWrapper && (!0 === model.CanEdit ? personWrapper.removeAttribute("disabled", "disabled") : personWrapper.setAttribute("disabled", "disabled"))
                        }(model),
                        function(model) {
                            var containers = doc.getElementsByClassName(additionalFieldsClass),
                                values = model.AdditionalFieldValues;
                            values && _.each(containers, function(cb) {
                                cb = cb.getElementsByTagName("input")[0];
                                values[+cb.value] ? cb.checked = !0 : cb.checked = !1
                            })
                        }(model),
                        function(model) {
                            !0 === model.IsPublished ? hours.setAttribute("disabled", "disabled") : hours.removeAttribute("disabled", "disabled"), hours.value = model.Hours || ""
                        }(model), formIsValid(!1), "function" == typeof showCb && showCb.call()
                }).fail(function() {}).always(function() {})
            }
        }), saveBtn.addEventListener("click", function() {
            switchSaveBtnState(!0), post(function() {
                switchSaveBtnState(!1)
            })
        }), person.addEventListener("change", function() {
            validatePerson(!0), formIsValid(!1)
        }), subject.addEventListener("change", function() {
            validateSubject(!0), formIsValid(!1)
        }), hours.addEventListener("change", function() {
            validateHours(!0), formIsValid(!1)
        }), group.addEventListener("change", function() {
            validateGroup(!0), formIsValid(!1)
        })
    }
});
define("CtpCopyDuplicateWarning/CtpCopyDuplicateWarning", ["CtpPopup/CtpPopup_utils"], function(utils) {
    return function(popupId) {
        "use strict";
        var doc = document,
            popupId = popupId.id,
            wrapper = doc.getElementById(popupId);
        wrapper.update = function(text, url) {
            doc.getElementById("ctp-copy-duplicate-warning-message").innerHTML = text, wrapper.getElementsByTagName("a")[0].href = url
        }
    }
});
define("CtpCreateSectionPopup/CtpCreateSectionPopup", ["CtpPopup/CtpPopup_utils"], function(utils) {
    "use strict";
    return function(model) {
        var doc = document,
            generalError = model.generalError,
            popupId = model.id,
            ctpId = (doc.getElementById(popupId), model.ctpId),
            sectionId = model.sectionId,
            createTitle = model.createTitle,
            editTitle = model.editTitle,
            saveUrl = model.saveUrl,
            getUrl = model.getUrl,
            errorBlock = doc.getElementById("ctp-create-section-error-block"),
            title = doc.getElementsByName("Title")[0],
            uud = doc.getElementsByName("Uud")[0],
            saveButton = doc.getElementById("saveSectionBtn"),
            popupTitle = doc.getElementById("create-section-popup-title");

        function formIsValid(valid) {
            errorBlock.innerHTML = "";
            valid = validateTitle(valid);
            return switchBtnState(!valid), valid
        }

        function validateTitle(showError) {
            return !title.value || title.value <= 0 ? (showError && title.classList.add("input_only-for-ctp-error"), !1) : (title.classList.remove("input_only-for-ctp-error"), !0)
        }

        function switchBtnState(disabled) {
            disabled ? saveButton.setAttribute("disabled", "disabled") : saveButton.removeAttribute("disabled")
        }
        utils.findContent(popupId, function(content) {
            content.initialize = function(showCb, url) {
                sectionId = url, title.classList.remove("input_only-for-ctp-error"), errorBlock.innerHTML = "", sectionId ? (url = getUrl.replace("sectionId", sectionId), $.get(url, function(response) {
                    popupTitle.innerText = editTitle, title.value = response.title, uud.value = response.uud, formIsValid(!1), showCb.call()
                }).fail(function() {
                    errorBlock.innerHTML = generalError
                })) : (popupTitle.innerHTML = createTitle, title.value = "", uud.value = "", formIsValid(!1), showCb.call())
            }
        }), title.addEventListener("blur", function() {
            validateTitle(!0), formIsValid(!1)
        }), saveButton.addEventListener("click", function() {
            var model = {
                CtpId: ctpId,
                SectionId: sectionId,
                Title: title.value,
                Uud: uud.value
            };
            !saveButton.hasAttribute("disabled") && formIsValid(!0) && (switchBtnState(!0), $.post(saveUrl, model, function(response) {
                response.errors ? (errorBlock.innerHTML = response.errors, switchBtnState(!1)) : window.location.reload()
            }).fail(function() {
                errorBlock.innerHTML = generalError, switchBtnState(!1)
            }))
        })
    }
});
define("CtpDistributionStep2/CtpDistributionStep2", function() {
    "use strict";
    return function(model) {
        var sectionExpandedClass = "grey-table__thead-text_white-pointer-up",
            sectionTableHiddenClass = "grey-table__tbody_hidden",
            buttonDisabledClass = "button_height-disabled",
            doc = document,
            sectionExpanderElements = doc.getElementsByClassName("grey-table__thead-text_white-pointer"),
            totalSelectedHoursElement = doc.getElementById("totalSelectedHours"),
            nextButtonElement = doc.getElementById("ctpDistributionWizardNextButton"),
            topicsCheckBoxElements = doc.querySelectorAll("[data-master-section-id]"),
            sectionsCheckBoxElements = doc.querySelectorAll("[data-section-id]");

        function invertSectionExpander(sectionTableElement) {
            var sourceElement = sectionTableElement.target || sectionTableElement.srcElement,
                sectionIsExpanded = sourceElement.classList.contains(sectionExpandedClass),
                sectionTableElement = sourceElement.getAttribute("data-linked-table-id"),
                sectionTableElement = doc.getElementById(sectionTableElement);
            sectionIsExpanded ? (sourceElement.classList.remove(sectionExpandedClass), sectionTableElement && sectionTableElement.classList.add(sectionTableHiddenClass)) : (sourceElement.classList.add(sectionExpandedClass), sectionTableElement && sectionTableElement.classList.remove(sectionTableHiddenClass))
        }

        function calculateSelectedHours() {
            var selectedElements = doc.querySelectorAll("[data-master-section-id]:checked");
            selectedElements && (totalSelectedHoursElement.innerHTML = selectedElements.length)
        }

        function switchNextBtnState() {
            var selectedElements = doc.querySelectorAll("[data-master-section-id]:checked");
            selectedElements && 0 < selectedElements.length ? (nextButtonElement.removeAttribute("disabled"), nextButtonElement.classList.remove(buttonDisabledClass)) : (nextButtonElement.classList.add(buttonDisabledClass), nextButtonElement.setAttribute("disabled", "disabled"))
        }

        function processTopicCheckBoxChanges() {
            calculateSelectedHours(), switchNextBtnState()
        }

        function processSectionCheckBoxesChanges(sectionCheckBoxes) {
            var sourceElement = sectionCheckBoxes.target || sectionCheckBoxes.srcElement,
                sectionCheckBoxes = sourceElement.getAttribute("data-section-id"),
                sectionCheckBoxes = doc.querySelectorAll('[data-master-section-id="' + sectionCheckBoxes + '"]');
            sectionCheckBoxes && sectionCheckBoxes.length && _.each(sectionCheckBoxes, function(e) {
                e.checked = sourceElement.checked
            }), calculateSelectedHours(), switchNextBtnState()
        }
        sectionExpanderElements && sectionExpanderElements.length && Array.prototype.forEach.call(sectionExpanderElements, function(e) {
            e.addEventListener("click", invertSectionExpander)
        }), topicsCheckBoxElements && topicsCheckBoxElements.length && _.each(topicsCheckBoxElements, function(e) {
            e.addEventListener("click", processTopicCheckBoxChanges)
        }), sectionsCheckBoxElements && sectionsCheckBoxElements.length && _.each(sectionsCheckBoxElements, function(e) {
            e.addEventListener("click", processSectionCheckBoxesChanges)
        }), calculateSelectedHours(), switchNextBtnState()
    }
});
define("CtpDistributionStep3/CtpDistributionStep3", ["CtpPopup/CtpPopup_utils"], function(utils) {
    "use strict";
    return function(model) {
        var buttonDisabledClass = "button_height-disabled",
            isSubmitEnabled = model.isSubmitEnabled,
            submitUrl = model.submitUrl,
            generalError = model.generalError,
            detailsUrl = model.detailsUrl,
            infoPopupId = model.infoPopupId,
            publishButtonElement = document.getElementById("ctpDistributionWizardPublishButton");

        function redirectToDetails() {
            window.location.href = detailsUrl
        }

        function showInfoPopup(message, customCallback) {
            utils.showPopup(infoPopupId, message, customCallback)
        }

        function submitDistribution() {
            $.post(submitUrl, $("#distributionSubmitForm").serialize(), function(result) {
                result.error ? showInfoPopup(result.error) : result.message && showInfoPopup(result.message, redirectToDetails)
            }).fail(function() {
                showInfoPopup(generalError)
            })
        }
        isSubmitEnabled ? (publishButtonElement.removeAttribute("disabled"), publishButtonElement.classList.remove(buttonDisabledClass)) : (publishButtonElement.classList.add(buttonDisabledClass), publishButtonElement.setAttribute("disabled", "disabled")), publishButtonElement.addEventListener("click", submitDistribution)
    }
});
define("CtpEditTopicPopup/CtpEditTopicPopup", ["CtpPopup/CtpPopup_utils", "NewCalendar/NewCalendar_Utils"], function(utils, calendarUtils) {
    return function(model) {
        var _maxParallelAnimations = 6,
            doc = document,
            popupId = model.id,
            popup = doc.getElementById(popupId),
            createTopicActionUrl = model.createTopicActionUrl,
            createSectionTopicActionUrl = model.createSectionTopicActionUrl,
            updateTopicActionUrl = model.updateTopicActionUrl,
            updateSectionTopicActionUrl = model.updateSectionTopicActionUrl,
            getTopicDataUrl = model.getTopicDataUrl,
            generalError = model.generalError,
            popupTitle = model.popupTitle,
            ctpId = model.ctpId,
            undistributedCtpHours = model.undistributedCtpHours,
            confirmPopupId = model.confirmPopupId,
            popupTitleElement = doc.getElementById("ctpTopicCreatePopupTitle"),
            nameInput = doc.getElementById("ctpTopicCreatePopupNameField"),
            hoursInput = popup.querySelector("[name = '" + model.hoursInputName + "']"),
            contentInput = doc.getElementById("ctpTopicCreatePopupContentField"),
            lessonTypeInput = doc.getElementById("ctpTopicCreatePopupLessonTypeField"),
            homeworkInput = doc.getElementById("ctpTopicCreatePopupHomeworkField"),
            learningActivityInput = doc.getElementById("ctpTopicCreatePopupLearningActivityField"),
            resultInput = doc.getElementById("ctpTopicCreatePopupResultField"),
            problemSolvingInput = doc.getElementById("ctpTopicCreatePopupProblemSolvingField"),
            kindOfControlInput = doc.getElementById("ctpTopicCreatePopupKindOfControlField"),
            saveBtn = doc.getElementById("saveCtpTopicBtn"),
            errorMessageBlock = doc.getElementById("cpt-topic-create-error-block"),
            hoursControl = doc.getElementById(model.hoursControlId),
            datesCollectionElement = popup.querySelector("[name = 'datesCollection']"),
            sectionId = null,
            topicId = null,
            initialTopicHours = 0,
            calendarMonths = model.calendar.months,
            calendarMonthsShort = model.calendar.monthsShort;

        function switchBtnState(disabled) {
            disabled ? saveBtn.setAttribute("disabled", "disabled") : saveBtn.removeAttribute("disabled")
        }

        function showErrorMessage(message) {
            errorMessageBlock.innerHTML = message
        }

        function clearErrorMessage() {
            errorMessageBlock.innerHTML = ""
        }

        function collectDatesInputs() {
            return datesCollectionElement.getElementsByTagName("input")
        }

        function showErrorOnElement(el) {
            el.classList.add("small-input_red-border")
        }

        function clearErrorOnElement(el) {
            el.classList.remove("small-input_red-border")
        }

        function formIsValid(showError) {
            clearErrorMessage();
            var valid = !0,
                valid = validateName(showError) && valid,
                dateElements = collectDatesInputs();
            return _.each(dateElements, function(item) {
                valid = validateDate(item, showError) && valid
            }), switchBtnState(!valid), valid
        }

        function validateName(showError) {
            return nameInput.value ? (clearErrorOnElement(nameInput), !0) : (showError && showErrorOnElement(nameInput), !1)
        }

        function validateDate(item, showError) {
            return item.value && /^(0?[1-9]|[12][0-9]|3[0-1])[.](0?[1-9]|1[0-2])[.]([0-9]{4})$/.exec(item.value) ? (clearErrorOnElement(item), !0) : (showError && showErrorOnElement(item), !1)
        }

        function postData(complete) {
            var currentActionUrl = function() {
                    var currentActionUrl = topicId ? (sectionId ? updateSectionTopicActionUrl.replace("sectionId", sectionId) : updateTopicActionUrl).replace("topicId", topicId) : sectionId ? createSectionTopicActionUrl.replace("sectionId", sectionId) : createTopicActionUrl;
                    return currentActionUrl = currentActionUrl.replace("ctpId", ctpId)
                }(),
                data = function() {
                    for (var dateElements = collectDatesInputs(), datesCount = _.size(dateElements), topicDates = [], index = 0; index < datesCount; ++index) {
                        var item = dateElements[index];
                        topicDates.push(item.value)
                    }
                    return {
                        name: nameInput.value,
                        hours: hoursInput.value,
                        content: contentInput.value,
                        lessonType: lessonTypeInput.value,
                        learningActivity: learningActivityInput.value,
                        homework: homeworkInput.value,
                        result: resultInput.value,
                        problemSolving: problemSolvingInput.value,
                        kindOfControl: kindOfControlInput.value,
                        topicDates: topicDates
                    }
                }();
            $.post(currentActionUrl, $.param(data, !0), function(result) {
                result.error ? showErrorMessage(result.error) : (clearErrorMessage(), utils.closePopup(popupId), location.reload())
            }).fail(function() {
                showErrorMessage(generalError)
            }).done(function() {
                "function" == typeof complete && complete.call()
            })
        }

        function saveTopic(el) {
            var complete;
            el.target || el.srcElement;
            switchBtnState(!0), complete = function() {
                switchBtnState(!1)
            }, formIsValid(!0) ? undistributedCtpHours + initialTopicHours < +hoursInput.value ? utils.showPopup(confirmPopupId, function() {
                postData(complete)
            }, function() {
                switchBtnState(!1)
            }) : postData(complete) : "function" == typeof complete && complete.call()
        }

        function deleteDates(count, datesElements) {
            for (var arraySize = _.size(datesElements), index = arraySize - 1; arraySize - count - 1 < index; --index) datesCollectionElement.removeChild(datesElements[index])
        }

        function createNewDateInputWithAnimation(top) {
            var el = createNewDateInputElement(top);
            el.setAttribute("style", "visibility:hidden");
            var animateEl = function(el) {
                el = el.cloneNode(!0);
                return el.value = "", popup.getElementsByClassName("ctp-popup__popup")[0].appendChild(el), el.style.left = hoursInput.offsetLeft + "px", el.style.top = hoursInput.offsetTop + "px", el.className = el.className + " input-date_animated", el
            }(top);
            animateEl.addEventListener("transitionend", function(event) {
                "top" === event.propertyName && (animateEl.parentElement.removeChild(animateEl), el.removeAttribute("style"))
            });
            top = Math.min(el.offsetTop - datesCollectionElement.scrollTop, datesCollectionElement.offsetHeight);
            animateEl.style.left = datesCollectionElement.offsetLeft + el.offsetLeft + "px", animateEl.style.top = datesCollectionElement.offsetTop + top + "px"
        }

        function createNewDateInputElement(el) {
            el = el.cloneNode(!0);
            return el.value = "", datesCollectionElement.appendChild(el), calendarUtils.initFixed(el, calendarMonths, calendarMonthsShort), SetChangeEventHandlerForDateInputs(el), el
        }

        function addDates(count, pattern, allowAnimation) {
            for (var index = 0; index < count; ++index)(allowAnimation && index < _maxParallelAnimations ? createNewDateInputWithAnimation : function(pattern) {
                createNewDateInputElement(pattern)
            })(pattern)
        }

        function changeDates(allowAnimation) {
            var dateElements, datesCount, hours = parseInt(hoursInput.value, 10);
            isNaN(hours) || (dateElements = collectDatesInputs(), hours < (datesCount = _.size(dateElements)) ? deleteDates(datesCount - hours, dateElements) : datesCount < hours && addDates(hours - datesCount, _.first(dateElements), allowAnimation))
        }

        function commonInitialElementsSetup() {
            switchBtnState(!1);
            var dateElements = collectDatesInputs();
            deleteDates(_.size(dateElements) - 1, dateElements), dateElements[0].value = "", clearErrorOnElement(dateElements[0]), clearErrorOnElement(nameInput), clearErrorMessage()
        }

        function loadInitialDataPopupState(response) {
            if (commonInitialElementsSetup(), nameInput.value = response.Title, hoursInput.value = response.Hours, initialTopicHours = parseInt(response.Hours), changeDates(!1), contentInput.value = response.Content, lessonTypeInput.value = response.LessonType, homeworkInput.value = response.HomeWork, learningActivityInput.value = response.LearningActivity, resultInput.value = response.Result, problemSolvingInput.value = response.ProblemSolving, kindOfControlInput.value = response.KindOfControl, response.TopicDates)
                for (var dateElements = collectDatesInputs(), datesCount = _.size(response.TopicDates), i = 0; i < datesCount; i++) dateElements[i].value = response.TopicDates[i]
        }

        function configureContent() {
            var actionUrl;
            popupTitleElement.innerHTML = popupTitle, topicId ? (actionUrl = getTopicDataUrl.replace("ctpId", ctpId).replace("topicId", topicId), $.get(actionUrl, loadInitialDataPopupState).fail(function() {
                showErrorMessage(generalError)
            })) : (commonInitialElementsSetup(), nameInput.value = "", hoursInput.value = "1", initialTopicHours = 0, contentInput.value = "", lessonTypeInput.value = "", homeworkInput.value = "", learningActivityInput.value = "", resultInput.value = "", problemSolvingInput.value = "", kindOfControlInput.value = ""), saveBtn.addEventListener("click", saveTopic), hoursControl.addEventListener("change", function() {
                changeDates(!0)
            }), formIsValid(!1)
        }

        function SetChangeEventHandlerForDateInputs(dateElement) {
            dateElement.addEventListener("change", function() {
                validateDate(dateElement, !0), formIsValid(!1)
            })
        }
        nameInput.addEventListener("change", function() {
            validateName(!0), formIsValid(!1)
        }), Array.prototype.forEach.call(collectDatesInputs(), function(dateElement) {
            SetChangeEventHandlerForDateInputs(dateElement)
        }), utils.findContent(popupId, function(content) {
            content.initialize = function(showCb, el) {
                ! function(el) {
                    topicId = el.getAttribute("data-topicid"), sectionId = el.getAttribute("data-sectionid"), el.getAttribute("data-title") && (popupTitle = el.getAttribute("data-title"))
                }(el), configureContent(), showCb.call()
            }
        })
    }
});
define("CtpExistsConfirmPopup/CtpExistsConfirmPopup", function() {
    "use strict";
    return function(model) {
        document.getElementById("ctp-exists-message"), document.getElementsByName("GroupId")[0], document.getElementsByName("SubjectId")[0];

        function closePopup() {
            var popup = document.getElementById("ctp-exists-popup");
            popup.className = popup.className.replace("ctp-popup_active", "")
        }
        document.getElementById("ctp-close-btn").addEventListener("click", closePopup), document.getElementById("ctp-exists-ok-btn").addEventListener("click", function() {
            closePopup(), model.callBack()
        })
    }
});
define("CtpHoursControl/CtpHoursControl", ["utils/dispatchevent"], function(eventDispatcher) {
    return function(model) {
        var controlId = model.id,
            contol = document.getElementById(controlId),
            valueInput = contol.querySelector("[name = '" + model.valueInputName + "']"),
            increaseButton = contol.querySelector("[name = '" + model.increaseButtonName + "']"),
            decreaseButton = contol.querySelector("[name = '" + model.decreaseButtonName + "']"),
            minValue = isNaN(parseInt(model.minValue)) ? 1 : model.minValue,
            maxValue = isNaN(parseInt(model.maxValue)) ? 999 : model.maxValue,
            defaultValue = isNaN(parseInt(model.defaultValue)) ? minValue : model.defaultValue;

        function riseChangeEvent() {
            eventDispatcher.call(null, "change", contol)
        }

        function increaseNumber() {
            var currentValue = parseInt(valueInput.value, 10);
            isNaN(currentValue) ? currentValue = defaultValue : currentValue++, correctMinMaxValue(valueInput.value = currentValue), riseChangeEvent()
        }

        function decreaseNumber() {
            var currentValue = parseInt(valueInput.value, 10);
            isNaN(currentValue) ? currentValue = defaultValue : currentValue--, correctMinMaxValue(valueInput.value = currentValue), riseChangeEvent()
        }

        function correctMinMaxValue(currentValue) {
            currentValue < minValue && (valueInput.value = minValue), maxValue < currentValue && (valueInput.value = maxValue)
        }

        function correctValue() {
            var currentValue = parseInt(valueInput.value, 10);
            isNaN(currentValue) ? valueInput.value = defaultValue : correctMinMaxValue(valueInput.value = currentValue), riseChangeEvent()
        }
        increaseButton.addEventListener("click", increaseNumber), decreaseButton.addEventListener("click", decreaseNumber), valueInput.addEventListener("input", correctValue)
    }
});
define("CtpDetails/CtpDetails", ["CtpPopup/CtpPopup_utils"], function(utils) {
    "use strict";
    return function() {
        var copyBtn = document.getElementById("copyCtpBtn"),
            addSectionBtn = document.getElementById("addSectionBtn"),
            publicationButton = document.getElementById("ctp-publication-button"),
            unpublishButton = document.getElementById("ctp-unpublish-button");

        function sectionEditButtonClickEventHandler() {
            var sectionId = this.getAttribute("data-val");
            return utils.showPopup("ctp-create-section-popup", sectionId), !1
        }
        copyBtn && copyBtn.addEventListener("click", function() {
            utils.showPopup("ctp-copy-popup")
        }), addSectionBtn && addSectionBtn.addEventListener("click", function() {
            utils.showPopup("ctp-create-section-popup")
        }), publicationButton && publicationButton.addEventListener("click", function() {
            var element = document.getElementById("ctp-publication-popup");
            utils.showPopup("ctp-publication-popup", element)
        }), unpublishButton && unpublishButton.addEventListener("click", function() {
            utils.showPopup("ctp-unpublish-popup")
        });
        var sectionEditButtons = document.getElementsByClassName("ctp-section-edit-button");
        if (sectionEditButtons)
            for (var i = 0; i < sectionEditButtons.length; i++) sectionEditButtons[i].addEventListener("click", sectionEditButtonClickEventHandler);

        function sectionDetailsButtonClickEventHandler() {
            var sectionId = this.getAttribute("data-val");
            return utils.showPopup("ctp-section-details-popup", sectionId), !1
        }
        var sectionDetailsButtons = document.getElementsByClassName("ctp-section-details-button");
        if (sectionDetailsButtons)
            for (i = 0; i < sectionDetailsButtons.length; i++) sectionDetailsButtons[i].addEventListener("click", sectionDetailsButtonClickEventHandler);

        function topicDetailsButtonClickEventHandler() {
            var sectionId = this.getAttribute("data-sectionid"),
                topicId = this.getAttribute("data-topicid");
            return utils.showPopup("ctp-topic-details-popup", sectionId, topicId), !1
        }
        var topicDetailsButtons = document.getElementsByClassName("ctp-topic-details-button");
        if (topicDetailsButtons)
            for (i = 0; i < topicDetailsButtons.length; i++) topicDetailsButtons[i].addEventListener("click", topicDetailsButtonClickEventHandler)
    }
});
define("CtpInfoPopup/CtpInfoPopup", ["CtpPopup/CtpPopup_utils"], function(utils) {
    return function(model) {
        var popupId = model.id,
            shouldReloadPageAfterClose = model.shouldReloadPageAfterClose;
        utils.findContent(popupId, function(content) {
            content.initialize = function(showCb, message, customAction) {
                ! function(content, message) {
                    content.getElementsByTagName("h2")[0].innerHTML = message
                }(content, message), setTimeout(function() {
                    customAction && "function" == typeof customAction && customAction.call(), utils.closePopup(popupId), !0 === shouldReloadPageAfterClose && location.reload()
                }, 3e3), showCb.call()
            }
        })
    }
});
define("CtpPublicationPopup/CtpPublicationPopup", ["CtpPopup/CtpPopup_utils", "utils/template"], function(utils, templater) {
    return function(model) {
        var popupId = model.id,
            publishedPopupId = model.publishedPopupId,
            generalError = model.generalError,
            actionUrl = model.actionUrl,
            infoPopupId = model.infoPopupId;

        function closePopup() {
            utils.closePopup(popupId)
        }

        function showInfoPopup(message) {
            utils.showPopup(infoPopupId, message)
        }

        function switchBtnState(disabled, btn) {
            disabled ? btn.setAttribute("disabled", "disabled") : btn.removeAttribute("disabled")
        }

        function publishCtp(el) {
            var complete, target = el.target || el.srcElement;
            switchBtnState(!0, target), complete = function() {
                switchBtnState(!1, target)
            }, $.post(actionUrl, function(result) {
                closePopup(), result.HasError ? showInfoPopup(result.Message) : (utils.closePopup(popupId), utils.showPopup(publishedPopupId, result.Url))
            }).fail(function() {
                closePopup(), showInfoPopup(generalError)
            }).done(function() {
                "function" == typeof complete && complete.call()
            })
        }
        utils.findContent(popupId, function(content) {
            content.initialize = function(showCb, el) {
                var deleteBtn;
                (deleteBtn = (deleteBtn = content).getElementsByTagName("input")[0]) && deleteBtn.addEventListener("click", publishCtp), showCb.call()
            }
        })
    }
});
define("CtpReadonlySectionPopup/CtpReadonlySectionPopup", ["CtpPopup/CtpPopup_utils", "utils/template"], function(utils, templater) {
    "use strict";
    return function(model) {
        var topicCount, doc = document,
            popupId = model.id,
            editPopupId = model.editPopupId,
            errorBlock = (doc.getElementById(popupId), doc.getElementById("ctp-section-details-error-block")),
            sectionId = 0,
            getUrl = model.getUrl,
            title = doc.getElementById("ctp-section-details-title"),
            uud = doc.getElementById("ctp-section-details-uud"),
            editButton = doc.getElementById("ctp-section-details-edit-button"),
            deleteButton = doc.getElementById("ctp-section-details-delete-button"),
            generalError = model.generalError;
        utils.findContent(popupId, function(content) {
            content.initialize = function(showCb, currentSectionId) {
                sectionId = currentSectionId;
                var url = [];
                url.sectionId = encodeURIComponent(currentSectionId);
                url = templater(decodeURIComponent(getUrl), url);
                $.get(url, function(response) {
                    title.innerText = response.title, uud.innerText = response.uud, topicCount = response.topicCount, deleteButton && (deleteButton.setAttribute("data-sectionid", sectionId), deleteButton.setAttribute("data-title", title.innerHTML), deleteButton.setAttribute("data-count", topicCount)), errorBlock.innerHTML = "", showCb.call()
                }).fail(function() {
                    errorBlock.innerHTML = generalError
                })
            }
        }), editButton && editButton.addEventListener("click", function() {
            utils.closePopup(popupId), utils.showPopup(editPopupId, sectionId)
        }), deleteButton && deleteButton.addEventListener("click", function() {
            var deletePopupId = deleteButton.getAttribute("data-popupid");
            utils.showPopup(deletePopupId, deleteButton, function() {
                utils.closePopup(popupId)
            })
        })
    }
});
define("CtpPublicationConfirmPopup/CtpPublicationConfirmPopup", ["CtpPopup/CtpPopup_utils", "utils/template"], function(utils, templater) {
    return function(popup) {
        var popupId = popup.id,
            messageTemplate = popup.messageTemplate,
            popupTitle = popup.popupTitle,
            acceptButtonLabel = popup.acceptButtonLabel,
            rejectButtonLabel = popup.rejectButtonLabel,
            distributionUrl = null,
            popup = document.getElementById(popupId),
            popupTitleElement = popup.querySelector("[name = 'popupTitle']"),
            popupMessageElement = popup.querySelector("[name = 'popupMessage']"),
            acceptButton = popup.querySelector("[name = 'acceptButton']"),
            rejectButton = popup.querySelector("[name = 'rejectButton']");

        function closePopup() {
            utils.closePopup(popupId)
        }

        function acceptButtonAction() {
            closePopup(), distributionUrl && (window.location.href = distributionUrl)
        }

        function rejectButtonAction() {
            closePopup(), window.location.reload()
        }
        utils.findContent(popupId, function(content) {
            content.initialize = function(showCb, url) {
                (distributionUrl = url) || (acceptButton.style.display = "none"), popupTitleElement.innerHTML = popupTitle, popupMessageElement.innerHTML = messageTemplate, acceptButton.value = acceptButtonLabel, rejectButton.value = rejectButtonLabel, acceptButton.addEventListener("click", acceptButtonAction), rejectButton.addEventListener("click", rejectButtonAction), showCb.call()
            }
        })
    }
});
define("CtpReadonlyThemePopup/CtpReadonlyThemePopup", ["CtpPopup/CtpPopup_utils", "utils/template"], function(utils, templater) {
    "use strict";
    return function(model) {
        var sectionId, topicId, doc = document,
            popupId = model.id,
            getUrl = (doc.getElementById(popupId), model.url),
            titleField = doc.getElementById("ctp-topic-title"),
            hoursField = doc.getElementById("ctp-topic-hours"),
            contentField = doc.getElementById("ctp-topic-content"),
            lessonTypeField = doc.getElementById("ctp-topic-lessonType"),
            learningActivityTypeField = doc.getElementById("ctp-topic-learningActivity"),
            problemSolvingField = doc.getElementById("ctp-topic-problemSolving"),
            resultField = doc.getElementById("ctp-topic-result"),
            homeWorkField = doc.getElementById("ctp-topic-homeWork"),
            kindOfControlField = doc.getElementById("ctp-topic-kindOfControl"),
            dateContainer = doc.getElementById("ctp-topic-date-container"),
            topicDateFiledTemplate = doc.getElementById("ctp-topic-date-item-template"),
            editButton = doc.getElementById("ctp-topic-details-edit-button"),
            deleteButton = doc.getElementById("ctp-topic-details-delete-button"),
            editTopicPopupId = model.editTopicPopupId;

        function closePopup() {
            utils.closePopup(popupId)
        }

        function showEditTopic() {
            closePopup(), utils.showPopup(editTopicPopupId, editButton)
        }

        function showDeleteConfirmPopup() {
            var deletePopupId = deleteButton.getAttribute("data-popupid");
            utils.showPopup(deletePopupId, deleteButton, closePopup)
        }
        utils.findContent(popupId, function(content) {
            content.initialize = function(showCb, url, currentTopicId) {
                sectionId = url, topicId = currentTopicId, editButton && editButton.addEventListener("click", showEditTopic), deleteButton && deleteButton.addEventListener("click", showDeleteConfirmPopup);
                url = [];
                url.topicid = currentTopicId;
                url = templater(decodeURIComponent(getUrl), url);
                $.get(url, function(response) {
                    ! function(response) {
                        titleField.innerText = response.Title, hoursField.innerText = response.Hours, contentField && (contentField.innerText = response.Content), lessonTypeField && (lessonTypeField.innerText = response.LessonType), learningActivityTypeField && (learningActivityTypeField.innerText = response.LearningActivity), problemSolvingField && (problemSolvingField.innerText = response.ProblemSolving), resultField && (resultField.innerText = response.Result), homeWorkField && (homeWorkField.innerText = response.HomeWork), kindOfControlField && (kindOfControlField.innerText = response.KindOfControl);
                        for (var dateElementList = dateContainer.getElementsByClassName("ctp-topic-date"), i = dateElementList.length - 1; 0 <= i; i--) dateElementList[i].parentNode.removeChild(dateElementList[i]);
                        for (i = 0; i < response.TopicDates.length; i++) {
                            var date = response.TopicDates[i],
                                item = topicDateFiledTemplate.childNodes[1].cloneNode(!0);
                            item.innerHTML = date, dateContainer.appendChild(item)
                        }
                    }(response), editButton && editButton.setAttribute("data-topicid", topicId), deleteButton && deleteButton.setAttribute("data-topicid", topicId), sectionId && (editButton && editButton.setAttribute("data-sectionid", sectionId), deleteButton && deleteButton.setAttribute("data-sectionid", sectionId)), showCb.call()
                }).fail(function() {
                    showCb.call()
                })
            }
        })
    }
});
define("CtpPopup/CtpPopup", ["CtpPopup/CtpPopup_utils"], function(utils) {
    "use strict";
    return function(closeElements) {
        var popupClass = "ctp-popup",
            id = closeElements.id,
            container = document.getElementById(id),
            closeElements = container ? container.getElementsByClassName("ctp-popup-close") : [];

        function close(evt) {
            var popup = container;
            popup || evt && evt.target && (popup = function(el) {
                for (;
                    (el = el.parentElement) && !el.classList.contains(popupClass););
                return el
            }(evt.target)), popup && popup.classList.remove("ctp-popup_active")
        }
        closeElements && closeElements.length && Array.prototype.forEach.call(closeElements, function(e) {
            e.addEventListener("click", close)
        }), container && (container.show = function() {
            for (var args = [function() {
                    container.classList.add("ctp-popup_active")
                }], i = 0, l = arguments.length; i < l; i++) args.push(arguments[i]);
            container && utils.findContent(id, function(content) {
                content.initialize ? content.initialize.apply(this, args) : container.classList.add("ctp-popup_active")
            })
        }, container.close = close)
    }
});
define("CtpPopup/CtpPopup_show", ["CtpPopup/CtpPopup_utils"], function(utils) {
    "use strict";
    return function(elementId) {
        var element, elementId = elementId.id;
        !elementId || (element = document.getElementById(elementId)) && element.addEventListener("click", function(containerId) {
            containerId.preventDefault();
            containerId = element.getAttribute("data-popupid");
            return containerId && utils.showPopup(containerId, element), !1
        })
    }
});
define("CtpPopup/CtpPopup_utils", function() {
    "use strict";
    return {
        findContent: function(content, foundCb) {
            if (content = document.getElementById(content)) {
                content = content.getElementsByClassName("ctp-popup__popup")[0];
                return "function" == typeof foundCb && foundCb.call(null, content), content
            }
            return null
        },
        closePopup: function(popup) {
            (popup = document.getElementById(popup)) && popup.close && popup.close()
        },
        showPopup: function(popup) {
            if ((popup = document.getElementById(popup)) && popup.show) {
                for (var args = [], i = 1; i < arguments.length; i++) args.push(arguments[i]);
                popup.show.apply(this, args)
            }
        }
    }
});
define("CtpUnpublishConfirmPopup/CtpUnpublishConfirmPopup", ["CtpPopup/CtpPopup_utils", "utils/template"], function(utils, templater) {
    return function(model) {
        var popupId = model.id,
            url = model.url,
            popup = document,
            infoPopupId = model.infoPopupId,
            generalError = model.generalError,
            popup = popup.getElementById(popupId),
            unpublishButton = popup.querySelector("[name = 'unpublishButton']"),
            unpublishWithCopyThemesButton = popup.querySelector("[name = 'unpublishWithCopyThemesButton']");

        function upbulishAction(copyThemes) {
            switchBtnState(!0), $.post(url, {
                copyThemes: copyThemes
            }, function(result) {
                actionDone(result.message), window.location.reload()
            }).fail(function() {
                actionDone(generalError)
            })
        }

        function actionDone(message) {
            utils.closePopup(popupId),
                function(message) {
                    utils.showPopup(infoPopupId, message)
                }(message)
        }

        function switchBtnState(disabled) {
            disabled ? (unpublishButton.setAttribute("disabled", "disabled"), unpublishWithCopyThemesButton && unpublishWithCopyThemesButton.setAttribute("disabled", "disabled")) : (unpublishButton.removeAttribute("disabled"), unpublishWithCopyThemesButton && unpublishWithCopyThemesButton.removeAttribute("disabled"))
        }
        utils.findContent(popupId, function(content) {
            content.initialize = function(showCb) {
                unpublishButton.addEventListener("click", function() {
                    upbulishAction(!1)
                }), unpublishWithCopyThemesButton && unpublishWithCopyThemesButton.addEventListener("click", function() {
                    upbulishAction(!0)
                }), switchBtnState(!1), showCb.call()
            }
        })
    }
});
define("AssessmentSwitchPopup/AssessmentSwitchPopup", ["Popup/Popup", "dialogs/dialogs"], function(Popup) {
    "use strict";
    return function(model) {
        var popupDlg = new Popup({
                id: model.popupId
            }),
            closePopup = popupDlg.getPopup(),
            continueButton = closePopup.querySelector(".assessment-switch-popup__continue"),
            cancelButton = closePopup.querySelector(".assessment-switch-popup__cancel"),
            closeButton = closePopup.querySelector(".popup__exit"),
            password = closePopup.querySelector(".assessment-switch-popup__password"),
            closePopup = function() {
                popupDlg.hidePopup(!0)
            };
        cancelButton.addEventListener("click", closePopup), closeButton.addEventListener("click", closePopup), continueButton.addEventListener("click", function() {
            $.ajax({
                type: "POST",
                url: model.popupContinueUrl,
                dataType: "json",
                data: {
                    password: password.value
                },
                success: function(data) {
                    data.error ? dnevnik.dialogs.error(data.error) : window.location.reload()
                }
            })
        })
    }
});
define("CalculateFinalMarkPopup/CalculateFinalMarkPopup", ["Popup/Popup", "dialogs/dialogs"], function(Popup) {
    "use strict";
    return function(model) {
        var popupDlg = new Popup({
                id: model.popupId
            }),
            closePopup = popupDlg.getPopup(),
            calculateButton = closePopup.querySelector(".calculate-final-mark-popup__calculate"),
            cancelButton = closePopup.querySelector(".calculate-final-mark-popup__cancel"),
            closeButton = closePopup.querySelector(".popup__exit"),
            closePopup = function() {
                popupDlg.hidePopup(!0)
            };
        cancelButton.addEventListener("click", closePopup), closeButton.addEventListener("click", closePopup), calculateButton.addEventListener("click", function() {
            $.ajax({
                type: "POST",
                url: model.calculateFinalMarkUrl,
                dataType: "json",
                data: {
                    calculate: !0
                },
                success: function(data) {
                    data.error ? dnevnik.dialogs.error(data.error) : window.location.reload()
                }
            })
        })
    }
});
define("MarkCommentPopup/MarkCommentPopup", ["Popup/Popup"], function(Popup) {
    "use strict";
    return function(cancelButton) {
        function closePopup() {
            popupDlg.hidePopup(!0, !0)
        }

        function checkComment(e) {
            e.stopPropagation(), "" === textArea.value ? textArea.classList.add("mark-comment-popup__comment-text_wrong") : popupDlg.hidePopup(!1)
        }
        var popupDlg = new Popup({
                id: cancelButton.popupId
            }),
            closeButton = popupDlg.getPopup(),
            textArea = closeButton.querySelector(".mark-comment-popup__comment-text"),
            saveButton = closeButton.querySelector(".mark-comment-popup__save"),
            cancelButton = closeButton.querySelector(".mark-comment-popup__cancel"),
            closeButton = closeButton.querySelector(".popup__exit");
        cancelButton.addEventListener("click", closePopup), closeButton.addEventListener("click", closePopup), saveButton.addEventListener("click", checkComment), document.addEventListener("keydown", function(e) {
            27 !== e.keyCode ? e.ctrlKey && 13 == e.keyCode && (e.stopPropagation(), checkComment(e)) : closePopup()
        }), document.addEventListener("click", function(e) {
            e.stopPropagation()
        })
    }
});
define("CriteriaJournalPeriodTable/CriteriaJournalPeriodTable", ["journalTable/journalTable", "Popup/Popup", "dialogs/dialogs"], function(journalTable, Popup) {
    "use strict";
    return function(model) {
        function updateTotals(totals) {
            _.each(totals, function(t) {
                var totalMarkCell = tableBody.querySelectorAll('.criteria-journal-period-table__body__cell_totals[data-student="' + t.student + '"]');
                _.each(totalMarkCell, function(cell) {
                    cell.innerText = t.total[cell.getAttribute("data-type")]
                });
                totalMarkCell = tableBody.querySelector('.criteria-journal-period-table__body__cell_total-mark[data-student="' + t.student + '"]');
                totalMarkCell && totalMarkCell.setAttribute("data-recommended-mark", t.total.recommendedTotalMark)
            })
        }

        function setLessonMarkValue(input, cellContent, previousMark, restore, callback) {
            var data = {
                groupId: input.parentElement.getAttribute("data-group"),
                lessonId: input.parentElement.getAttribute("data-lesson"),
                personId: input.parentElement.getAttribute("data-student"),
                workId: input.parentElement.getAttribute("data-work"),
                mark: input.value
            };
            askForCommentAndSendRequest(model.editLessonMarkUrl, data, previousMark, function(data) {
                data.error ? (dialogs.error(data.error || model.tryAgainError), restore()) : (function(input, cellContent, mark) {
                    var appearance = document.createElement("div");
                    appearance.innerText = mark.logEntryText, appearance.classList.add("criteria-journal-period-table__log-entry"), mark.logEntryStatus && appearance.classList.add("criteria-journal-period-table__log-entry_" + mark.logEntryStatus);
                    var markLabel = document.createElement("div");
                    markLabel.innerText = mark.markText, markLabel.classList.add("criteria-journal-period-table__lesson-mark-value"), mark.markMood && markLabel.classList.add("criteria-journal-period-table__lesson-mark-value_" + mark.markMood);
                    mark = document.createElement("div");
                    mark.classList.add("criteria-journal-period-table__lesson-mark"), mark.appendChild(markLabel), cellContent.innerHTML = "", cellContent.setAttribute("data-mark", input.value), appearance && cellContent.appendChild(appearance), cellContent.appendChild(mark), journalTable.dropSelection(!1)
                }(input, cellContent, data), callback && callback())
            }, restore)
        }

        function setMarkValue(input, cellContent, previousMark, restore, callback) {
            var data = {
                sectionId: input.parentElement.getAttribute("data-section"),
                personId: input.parentElement.getAttribute("data-student"),
                mark: input.value
            };
            askForCommentAndSendRequest(model.editMarkUrl, data, previousMark, function(data) {
                data.error ? (dialogs.error(data.error || model.tryAgainError), restore()) : (function(input, cellContent) {
                    cellContent.setAttribute("data-mark", input.value), cellContent.querySelector(".criteria-journal-period-table__mark").innerHTML = '<span class="criteria-journal-period-table__mark__property">' + input.value + "</span>", journalTable.dropSelection(!1)
                }(input, cellContent), updateTotals(data.totals), callback && callback())
            }, restore)
        }

        function setMaxValue(input, cellContent, previousMark, restore, callback) {
            var sectionId = input.parentElement.getAttribute("data-section"),
                data = {
                    sectionId: sectionId,
                    maxValue: input.value
                };
            askForCommentAndSendRequest(model.editMaxValueUrl, data, previousMark, function(data) {
                data.error ? (dialogs.error(data.error || model.tryAgainError), restore()) : (function(input, maxValueLabel, cells, sectionEnabled) {
                    maxValueLabel.setAttribute("data-mark", input.value), maxValueLabel.querySelector(".criteria-journal-period-table__mark").innerHTML = "<span>" + input.value + "</span>";
                    maxValueLabel = maxValueLabel.parentElement.querySelector(".criteria-journal-period-table__head__max-value-title");
                    "" !== input.value && maxValueLabel.classList.contains("criteria-journal-period-table__head__max-value-title_red") ? maxValueLabel.classList.remove("criteria-journal-period-table__head__max-value-title_red") : "" !== input.value || maxValueLabel.classList.contains("criteria-journal-period-table__head__max-value-title_red") || maxValueLabel.classList.add("criteria-journal-period-table__head__max-value-title_red"), journalTable.dropSelection(!1);
                    cells = tableBody.querySelectorAll('td[data-section="' + cells + '"]');
                    _.each(cells, function(cell) {
                        "True" === cell.dataset.permission && (sectionEnabled ? (cell.classList.remove("criteria-journal-period-table__body__cell_disabled"), cell.classList.add("table__editable-cell")) : (cell.classList.add("criteria-journal-period-table__body__cell_disabled"), cell.classList.remove("table__editable-cell")))
                    })
                }(input, cellContent, sectionId, data.sectionEnabled), updateTotals(data.totals), callback && callback())
            }, restore)
        }

        function setFinalMarkValue(input, cellContent, previousMark, restore, callback) {
            var data = {
                journalId: input.parentElement.getAttribute("data-journal"),
                periodId: input.parentElement.getAttribute("data-period"),
                personId: input.parentElement.getAttribute("data-student"),
                workType: input.parentElement.getAttribute("data-work-type"),
                mark: input.value,
                recommendedMark: input.parentElement.getAttribute("data-recommended-mark")
            };
            askForCommentAndSendRequest(model.editFinalMarkUrl, data, previousMark, function(data) {
                data.error ? (dialogs.error(data.error || model.tryAgainError), restore()) : (function(markText, cellContent, data) {
                    cellContent.setAttribute("data-mark", markText.value);
                    var mark = document.createElement("div"),
                        markText = document.createElement("span");
                    mark.classList.add("criteria-journal-year-table__final-mark"), markText.innerText = data.value, data.status && markText.classList.add("criteria-journal-year-table__final-mark_" + data.status), mark.appendChild(markText), cellContent.innerHTML = "", cellContent.appendChild(mark), journalTable.dropSelection(!1)
                }(input, cellContent, data), callback && callback())
            }, restore)
        }

        function addSection() {
            var data = {
                sectionType: this.getAttribute("data-section-type")
            };
            sendPostRequest(model.addSectionUrl, data, function(data) {
                data.error ? dialogs.error(data.error || model.tryAgainError) : window.location.reload()
            })
        }

        function deleteSection() {
            var data = {
                sectionId: this.getAttribute("data-section")
            };
            sendPostRequest(model.deleteSectionUrl, data, function(data) {
                data.error ? dialogs.error(data.error || model.tryAgainError) : data.hasSections ? window.location.reload() : window.location.replace(window.location.href.split("?")[0])
            })
        }
        var journalModel, addSectionItems, popupDlg, requestInProgress = !1,
            popupIsOpen = !1,
            dialogs = dnevnik.dialogs,
            root = document.getElementById(model.id),
            tableBody = root.querySelector(".criteria-journal-period-table__body"),
            calculateFinalMarkCheckbox = root.querySelector(".criteria-journal-period-table__head__checkbox__input"),
            sections = root.querySelector(".criteria-journal-period-table__so-button"),
            commentPopupDlg = new Popup({
                id: model.markCommentPopupId
            }),
            commentPopupEl = commentPopupDlg.getPopup(),
            textArea = commentPopupEl.querySelector(".mark-comment-popup__comment-text");
        model.isEditEnabled && (journalModel = {
            tableClass: ".criteria-journal-period-table",
            cellClass: "table__editable-cell",
            disabledCellClass: "criteria-journal-period-table__body__cell_disabled",
            inputLength: 7,
            inputClass: "criteria-journal-period-table__input",
            onEdit: function(input, cellContent, previousMark, restore, callback) {
                switch (input.parentElement.getAttribute("data-type")) {
                    case "lessonMark":
                        setLessonMarkValue(input, cellContent, previousMark, restore, callback);
                        break;
                    case "mark":
                        setMarkValue(input, cellContent, previousMark, restore, callback);
                        break;
                    case "maxValue":
                        setMaxValue(input, cellContent, previousMark, restore, callback);
                        break;
                    case "finalMark":
                        setFinalMarkValue(input, cellContent, previousMark, restore, callback)
                }
            }
        }, journalTable.init(journalModel), sections && (addSectionItems = root.querySelector(".criteria-journal-period-table__so-items"), sections.addEventListener("click", function(items) {
            items.stopPropagation(), addSectionItems.style.display = "block";
            items = root.querySelectorAll(".criteria-journal-period-table__so-items__item");
            _.each(items, function(item) {
                item.addEventListener("click", addSection)
            })
        }), document.addEventListener("click", function(e) {
            e.stopPropagation(), addSectionItems.style.display = "none"
        })), sections = root.querySelectorAll(".criteria-journal-period-table__head__section_delete"), model.isFinalMarkEditPeriodExpired || _.each(sections, function(section) {
            section.addEventListener("click", deleteSection)
        })), calculateFinalMarkCheckbox && ((popupDlg = new Popup({
            id: calculateFinalMarkCheckbox.getAttribute("data-open-popup-id")
        })).getPopup().onItemClosed = function() {
            calculateFinalMarkCheckbox.checked = !1
        }, calculateFinalMarkCheckbox.addEventListener("change", function(e) {
            this.checked ? function(e) {
                e.preventDefault(), popupDlg.showPopup()
            }(e) : sendPostRequest(model.calculateFinalMarkUrl, {
                calculate: !1
            }, function(data) {
                data.error ? dnevnik.dialogs.error(data.error) : window.location.reload()
            })
        }));
        var askForCommentAndSendRequest = function(url, data, previousMark, onSuccess, restore) {
                model.isMarkCommentRequired && previousMark ? (commentPopupDlg.showPopup(), popupIsOpen = !0, commentPopupEl.onItemClosed = function() {
                    data.comment = textArea.value, textArea.value = "", popupIsOpen = !1, sendPostRequest(url, data, onSuccess)
                }, commentPopupEl.onCancel = function() {
                    textArea.value = "", popupIsOpen = !1, restore()
                }) : popupIsOpen || sendPostRequest(url, data, onSuccess)
            },
            sendPostRequest = function(url, data, onSuccess) {
                requestInProgress || $.ajax({
                    type: "POST",
                    url: url,
                    dataType: "json",
                    data: data,
                    beforeSend: function() {
                        requestInProgress = !0
                    },
                    success: function(data) {
                        onSuccess(data)
                    },
                    complete: function() {
                        requestInProgress = !1
                    }
                })
            }
    }
});
define("JournalHeader/JournalHeader", ["Popup/Popup", "dialogs/dialogs"], function(Popup) {
    "use strict";
    return function(model) {
        var switchCheckbox = document.getElementById(model.id).querySelector(".toggle-switch__input");
        switchCheckbox && switchCheckbox.addEventListener("change", function() {
            $.ajax({
                type: "POST",
                url: model.summativeAssessmentSwitchUrl,
                dataType: "json",
                success: function(data) {
                    var popupDlg, popupEl;
                    data.success ? window.location.reload() : data.showPopup ? (popupEl = (popupDlg = new Popup({
                        id: model.assessmentSwitchPopupId
                    })).getPopup(), popupDlg.showPopup(), popupEl.onItemClosed = function() {
                        switchCheckbox.checked = !switchCheckbox.checked
                    }) : (switchCheckbox.checked = !switchCheckbox.checked, dnevnik.dialogs.error(data.error))
                }
            })
        })
    }
});
define("PhysicalFitnessJournalFilter/PhysicalFitnessJournalFilter", function() {
    return function(model) {
        function changeButtonAvailability() {
            0 < group.value ? button.hasAttribute("disabled") && (button.removeAttribute("disabled"), button.classList.remove("physical-fitness-journal-filter__button_disabled")) : button.hasAttribute("disabled") || (button.setAttribute("disabled", "disabled"), button.classList.add("physical-fitness-journal-filter__button_disabled"))
        }
        var root = document.getElementById(model.id),
            year = root.querySelector(".physical-fitness-journal-filter__year"),
            group = root.querySelector(".physical-fitness-journal-filter__group"),
            button = root.querySelector(".physical-fitness-journal-filter__button");
        year.addEventListener("change", function() {
            $.ajax({
                type: "POST",
                url: model.getSelectGroupListUrl,
                datatype: "json",
                data: {
                    schoolId: model.schoolId,
                    year: year.value
                },
                success: function(data) {
                    group.innerHTML = "", _.each(data, function(item) {
                        var option = document.createElement("option");
                        option.value = item.value, option.text = item.text, option.setAttribute("data-journal", item.journalUrl), group.add(option)
                    }), changeButtonAvailability()
                }
            })
        }), group.addEventListener("change", changeButtonAvailability), button.addEventListener("click", function() {
            var journalUrl = group.options[group.selectedIndex].getAttribute("data-journal");
            window.location.href = journalUrl
        })
    }
});
define("CriteriaJournalYearTable/CriteriaJournalYearTable", ["journalTable/journalTable", "Popup/Popup", "dialogs/dialogs"], function(journalTable, Popup) {
    "use strict";
    return function(model) {
        function setFinalMarkValue(input, cellContent, previousMark, restore, callback) {
            var data = {
                journalId: input.parentElement.getAttribute("data-journal"),
                periodId: input.parentElement.getAttribute("data-period"),
                personId: input.parentElement.getAttribute("data-student"),
                workType: input.parentElement.getAttribute("data-work-type"),
                mark: input.value,
                recommendedMark: input.parentElement.getAttribute("data-recommended-mark")
            };
            askForCommentAndSendRequest(model.editFinalMarkUrl, data, previousMark, function(data) {
                data.error ? (dialogs.error(data.error || model.tryAgainError), restore()) : (function(markText, cellContent, data) {
                    cellContent.setAttribute("data-mark", markText.value);
                    var mark = document.createElement("div"),
                        markText = document.createElement("span");
                    mark.classList.add("criteria-journal-year-table__final-mark"), markText.innerText = data.value, data.status && markText.classList.add("criteria-journal-year-table__final-mark_" + data.status), mark.appendChild(markText), cellContent.innerHTML = "", cellContent.appendChild(mark), journalTable.dropSelection(!1)
                }(input, cellContent, data), callback && callback())
            }, restore)
        }

        function setMaxValue(input, cellContent, previousMark, restore, callback) {
            var sectionId = input.parentElement.getAttribute("data-section"),
                data = {
                    sectionId: sectionId,
                    maxValue: input.value
                };
            askForCommentAndSendRequest(model.editExamScoreMaxValueUrl, data, previousMark, function(data) {
                data.error ? (dialogs.error(data.error || model.tryAgainError), restore()) : (function(input, cellContent, cells, sectionEnabled) {
                    cellContent.setAttribute("data-mark", input.value);
                    var mark = document.createElement("div"),
                        markText = document.createElement("span");
                    mark.classList.add("criteria-journal-year-table__mark"), markText.innerText = input.value;
                    var maxValueLabel = cellContent.parentElement.querySelector(".criteria-journal-year-table__head__max-value-title");
                    "" !== input.value && maxValueLabel.classList.contains("criteria-journal-year-table__head__max-value-title_red") ? maxValueLabel.classList.remove("criteria-journal-year-table__head__max-value-title_red") : "" !== input.value || maxValueLabel.classList.contains("criteria-journal-year-table__head__max-value-title_red") || maxValueLabel.classList.add("criteria-journal-year-table__head__max-value-title_red"), mark.appendChild(markText), cellContent.innerHTML = "", cellContent.appendChild(mark), journalTable.dropSelection(!1);
                    cells = tableBody.querySelectorAll('td[data-section="' + cells + '"]');
                    _.each(cells, function(cell) {
                        "True" === cell.dataset.permission && (sectionEnabled ? (cell.classList.remove("criteria-journal-year-table__body__cell_disabled"), cell.classList.add("table__editable-cell")) : (cell.classList.add("criteria-journal-year-table__body__cell_disabled"), cell.classList.remove("table__editable-cell")))
                    })
                }(input, cellContent, sectionId, data.sectionEnabled), callback && callback())
            }, restore)
        }

        function setMarkValue(input, cellContent, previousMark, restore, callback) {
            var data = {
                sectionId: input.parentElement.getAttribute("data-section"),
                personId: input.parentElement.getAttribute("data-student"),
                mark: input.value
            };
            askForCommentAndSendRequest(model.editMarkUrl, data, previousMark, function(data) {
                data.error ? (dialogs.error(data.error || model.tryAgainError), restore()) : (function(input, cellContent) {
                    cellContent.setAttribute("data-mark", input.value);
                    var mark = document.createElement("div"),
                        markText = document.createElement("span");
                    mark.classList.add("criteria-journal-year-table__mark"), markText.classList.add("criteria-journal-year-table__mark__property"), markText.innerText = input.value, mark.appendChild(markText), cellContent.innerHTML = "", cellContent.appendChild(mark), journalTable.dropSelection(!1)
                }(input, cellContent), callback && callback())
            }, restore)
        }
        var journalModel, requestInProgress = !1,
            popupIsOpen = !1,
            dialogs = dnevnik.dialogs,
            tableBody = document.getElementById(model.id).querySelector(".criteria-journal-year-table__body"),
            commentPopupDlg = new Popup({
                id: model.markCommentPopupId
            }),
            commentPopupEl = commentPopupDlg.getPopup(),
            textArea = commentPopupEl.querySelector(".mark-comment-popup__comment-text"),
            askForCommentAndSendRequest = function(url, data, previousMark, onSuccess, restore) {
                model.isMarkCommentRequired && previousMark ? (commentPopupDlg.showPopup(), popupIsOpen = !0, commentPopupEl.onItemClosed = function() {
                    data.comment = textArea.value, textArea.value = "", popupIsOpen = !1, sendPostRequest(url, data, onSuccess)
                }, commentPopupEl.onCancel = function() {
                    popupIsOpen = !1, restore()
                }) : popupIsOpen || sendPostRequest(url, data, onSuccess)
            },
            sendPostRequest = function(url, data, onSuccess) {
                requestInProgress || $.ajax({
                    type: "POST",
                    url: url,
                    dataType: "json",
                    data: data,
                    async: !0,
                    beforeSend: function() {
                        requestInProgress = !0
                    },
                    success: function(data) {
                        onSuccess(data)
                    },
                    complete: function() {
                        requestInProgress = !1
                    }
                })
            };
        model.isEditEnabled && (journalModel = {
            tableClass: ".criteria-journal-year-table",
            cellClass: "table__editable-cell",
            disabledCellClass: "criteria-journal-year-table__body__cell_disabled",
            inputLength: 7,
            inputClass: "criteria-journal-year-table__input",
            onEdit: function(input, cellContent, previousMark, restore, callback) {
                switch (input.parentElement.getAttribute("data-type")) {
                    case "finalMark":
                        setFinalMarkValue(input, cellContent, previousMark, restore, callback);
                        break;
                    case "maxValue":
                        setMaxValue(input, cellContent, previousMark, restore, callback);
                        break;
                    case "mark":
                        setMarkValue(input, cellContent, previousMark, restore, callback)
                }
            }
        }, journalTable.init(journalModel))
    }
});
define("PhysicalFitnessJournalTable/PhysicalFitnessJournalTable", ["journalTable/journalTable", "dialogs/dialogs"], function(journalTable) {
    "use strict";
    return function(model) {
        function setRunningDistanceValue(input, cellContent, restore, callback) {
            $.ajax({
                type: "POST",
                url: model.setRunningDistanceUrl,
                dataType: "json",
                data: {
                    journalId: model.journalId,
                    distance: input.value
                },
                async: !0,
                success: function(data) {
                    data.error ? dialogs.error(data.error || model.tryAgainError) : (function(input, cells, columnEnabled) {
                        cells.setAttribute("data-mark", input), cells.querySelector(".physical-fitness-journal-table__mark").innerHTML = "<span>" + input + "</span>";
                        cells = cells.parentElement.querySelector(".physical-fitness-journal-table__table-run-distance_title");
                        "" !== input ? cells.classList.toggle("physical-fitness-journal-table__table-run-distance_title_red", !1) : "" === input && cells.classList.toggle("physical-fitness-journal-table__table-run-distance_title_red", !0), journalTable.dropSelection(!1);
                        cells = tableBody.querySelectorAll(".physical-fitness-journal-table__table-td-run-time");
                        _.each(cells, function(cell) {
                            columnEnabled ? (cell.classList.remove("physical-fitness-journal-table__table-td_disabled"), cell.classList.add("table__editable-cell")) : (cell.classList.add("physical-fitness-journal-table__table-td_disabled"), cell.classList.remove("table__editable-cell"))
                        })
                    }(data.value, cellContent, data.columnEnabled), callback && callback())
                }
            })
        }

        function setCellValue(input, cellContent, restore, callback) {
            $.ajax({
                type: "POST",
                url: model.setCellValueUrl,
                dataType: "json",
                data: {
                    journalId: model.journalId,
                    personId: input.parentElement.getAttribute("data-student"),
                    stringValue: input.value,
                    column: input.parentElement.getAttribute("data-column")
                },
                async: !0,
                success: function(data) {
                    data.error ? dialogs.error(data.error || model.tryAgainError) : (function(input, cellContent) {
                        cellContent.setAttribute("data-mark", input), cellContent.querySelector(".physical-fitness-journal-table__mark").innerHTML = "<span>" + input + "</span>", journalTable.dropSelection(!1)
                    }(data.value, cellContent), callback && callback())
                }
            })
        }

        function setSummary(input, cellContent, restore, callback) {
            $.ajax({
                type: "POST",
                url: model.setSummaryUrl,
                dataType: "json",
                data: {
                    journalId: model.journalId,
                    personId: input.parentElement.getAttribute("data-student"),
                    mark: input.value
                },
                async: !0,
                success: function(data) {
                    data.error ? dialogs.error(data.error || model.tryAgainError) : (function(markText, cellContent, data) {
                        cellContent.setAttribute("data-mark", markText.value);
                        var mark = document.createElement("div"),
                            markText = document.createElement("span");
                        mark.classList.add("physical-fitness-journal-table__table-summary"), markText.innerText = data.value, data.status && markText.classList.add("physical-fitness-journal-table__table-summary_" + data.status), mark.appendChild(markText), cellContent.innerHTML = "", cellContent.appendChild(mark), journalTable.dropSelection(!1)
                    }(input, cellContent, data), callback && callback())
                }
            })
        }

        function createMask() {
            var v = this.value;
            null !== v.match(/^\d{2}$/) ? this.value = v + ":" : null !== v.match(/^\d{2}\:\d{2}$/) && (this.value = v + ".")
        }
        var dialogs = dnevnik.dialogs,
            tableBody = document.getElementById(model.id).querySelector(".physical-fitness-journal-table__body"),
            journalModel = {
                tableClass: ".physical-fitness-journal-table__table",
                cellClass: "table__editable-cell",
                disabledCellClass: "physical-fitness-journal-table__table-td_disabled",
                inputLength: 7,
                inputClass: "physical-fitness-journal-table__table-input",
                onEdit: function(input, cellContent, restore, callback) {
                    switch (input.parentElement.getAttribute("data-type")) {
                        case "runDistance":
                            setRunningDistanceValue(input, cellContent, 0, callback);
                            break;
                        case "summary":
                            setSummary(input, cellContent, 0, callback);
                            break;
                        case "pullUpCount":
                        case "runTime":
                        case "rightWristStrength":
                        case "leftWristStrength":
                        case "jumpingDistance":
                        case "ballThrowingDistance":
                            setCellValue(input, cellContent, 0, callback)
                    }
                },
                insertInputAtTheBeginningOfCell: !0,
                onCellActivation: function(cell, input) {
                    cell.querySelector("[data-placeholder]") && input.addEventListener("keyup", createMask)
                }
            };
        journalTable.init(journalModel)
    }
});
define("ScrollableTable/ScrollableTable", function() {
    "use strict";
    return function(root) {
        var root = document.getElementById(root.id),
            corner = root.querySelector(".scrollable-table__cell_corner"),
            head = root.querySelector(".scrollable-table__cell_head"),
            leftColumn = root.querySelector(".scrollable-table__cell_leftColumn"),
            body = root.querySelector(".scrollable-table__cell_body"),
            container = root.querySelector(".scrollable-table__cell_body__container");
        var scrollbarWidth = function() {
            var w2 = document.createElement("p");
            w2.style.width = "100%", w2.style.height = "200px";
            var outer = document.createElement("div");
            outer.style.position = "absolute", outer.style.top = "0px", outer.style.left = "0px", outer.style.visibility = "hidden", outer.style.width = "200px", outer.style.height = "150px", outer.style.overflow = "hidden", outer.appendChild(w2), document.body.appendChild(outer);
            var w1 = w2.offsetWidth;
            return outer.style.overflow = "scroll", w2 = w2.offsetWidth, w1 === w2 && (w2 = outer.clientWidth), document.body.removeChild(outer), w1 - w2
        }();

        function resize() {
            var availableSize = window.innerHeight - body.getBoundingClientRect().top - scrollbarWidth,
                bodyWidth = body.scrollHeight + scrollbarWidth,
                bodyWidth = Math.min(bodyWidth, availableSize - 1);
            body.style.height = bodyWidth + "px", leftColumn.style.height = bodyWidth - scrollbarWidth + "px";
            availableSize = window.innerWidth - leftColumn.getBoundingClientRect().right - scrollbarWidth, bodyWidth = container.getBoundingClientRect().width + scrollbarWidth + 1, bodyWidth = Math.min(availableSize, bodyWidth);
            body.style.maxWidth = bodyWidth + "px", head.style.maxWidth = body.getBoundingClientRect().width - scrollbarWidth + "px"
        }
        window.addEventListener("resize", resize), body.addEventListener("scroll", function() {
            head.scrollLeft = body.scrollLeft, leftColumn.scrollTop = body.scrollTop
        }), corner.style.height = head.clientHeight + "px", resize()
    }
});
define("Comments/Comments", ["LinesBothSides/LinesBothSides"], function(titledHr) {
    return function(settings) {
        function removeEventListeners(el) {
            var tmp = el.cloneNode(!0),
                val = el.value;
            return val && (tmp.value = val), el.parentNode.replaceChild(tmp, el), tmp
        }

        function rerender(o) {
            var cmtRoot = o.dom,
                where = o.placeholder;
            if (where) {
                for (; where.firstChild;) where.removeChild(where.firstChild);
                where.appendChild(cmtRoot)
            } else placeholder.appendChild(cmtRoot)
        }

        function sendhandlers(send) {
            input.tosend = removeEventListeners(input.tosend), input.tosend.addEventListener("click", function(e) {
                send(), e.preventDefault()
            }, !1), input.text__input = removeEventListeners(input.text__input), input.text__input.addEventListener("keydown", function(e) {
                e.ctrlKey && 13 == e.keyCode && (send(), e.preventDefault())
            }, !1), input.text__input.addEventListener("keyup", function(e) {
                setupInputSettings()
            }, !1)
        }
        var CommentsList = function() {
                function CommentsList(id) {
                    if (!id) throw new Error("Wrong item identifier.");
                    this.id = id, this.items = [], this.list = [], this.handlers = []
                }
                return CommentsList.prototype.load = function() {
                    var url = settings.path + "/get?id=" + this.id + "&_=" + $.now(),
                        self = this;
                    return Q($.get(url)).then(function(response) {
                        var i, length;
                        if (response && response.length)
                            for (i = 0, length = response.length; i < length; i += 1) self.items.push(new Comment(response[i]));
                        return self.items
                    })
                }, CommentsList.prototype.render = function(comments, placeholder) {
                    var span, dom = doc.createDocumentFragment(),
                        level = 0,
                        self = this,
                        recursiveRender = function(items) {
                            _(items).forEach(function(cmt) {
                                cmt.level = level, self.list[cmt.id] = cmt, level || (span = doc.createElement("div")).classList.add("comment-root_" + cmt.id), self.handlers.renderComment.forEach(function(commentMarkup) {
                                    commentMarkup = commentMarkup.call(self, cmt, level);
                                    commentMarkup && span.appendChild(commentMarkup)
                                }), level += 1, recursiveRender(cmt.children), --level || dom.appendChild(span)
                            })
                        };
                    return Q.Promise(function(resolve) {
                        recursiveRender(comments), self.handlers.changeCount.forEach(function(handler) {
                            handler.call(self, _.filter(self.list, function(cmt) {
                                return cmt && !cmt.deleted
                            }).length)
                        }), resolve({
                            dom: dom,
                            placeholder: placeholder
                        })
                    })
                }, CommentsList.prototype.add = function(to, comment) {
                    var toCmt = this.list[to],
                        self = this;
                    return toCmt.answer(comment).then(function(root) {
                        var temp = toCmt,
                            parent = toCmt;
                        for ((root.parent = toCmt).children.push(root), self.list[root.id] = root; temp.parent;) temp = parent = temp.parent;
                        root = doc.getElementsByClassName("comment-root_" + parent.id)[0];
                        return self.render([parent], root)
                    })
                }, CommentsList.prototype.new = function(comment) {
                    var self = this;
                    return Comment.new(this.id, comment).then(function(newCmt) {
                        return self.list[newCmt.id] = newCmt, self.items.push(newCmt), self.render([newCmt])
                    })
                }, CommentsList.prototype.delete = function(id) {
                    var deleteCmt = this.list[id],
                        temp = deleteCmt,
                        parent = deleteCmt,
                        self = this;
                    return deleteCmt.delete().then(function(root) {
                        if (deleteCmt.deleted = root, deleteCmt.deleted) {
                            for (; temp.parent;) parent = temp.parent, temp = parent;
                            root = doc.getElementsByClassName("comment-root_" + parent.id)[0];
                            return self.render([parent], root)
                        }
                    })
                }, CommentsList.prototype.like = function(id) {
                    var cmt = this.list[id];
                    return cmt.like().then(function(c) {
                        return cmt.alreadyLike = !0, cmt.likes = c
                    })
                }, CommentsList.prototype.on = function(key, handler) {
                    this.handlers[key] || (this.handlers[key] = []), this.handlers[key].push(handler)
                }, CommentsList
            }(),
            Comment = function() {
                function Comment(model) {
                    if (this.image = model.ImageUrl, this.nick = model.Nick, this.authorurl = model.AuthorUrl, this.date = model.Date, this.text = model.Text, this.likes = model.Likes, this.alreadyLike = model.AlreadyLike, this.deleted = model.IsDeleted, this.id = model.Id, this.candelete = model.CanDelete, this.parent = null, this.children = [], model.Children)
                        for (var i = 0, length = model.Children.length; i < length; i += 1) {
                            var child = new Comment(model.Children[i]);
                            (child.parent = this).children.push(child)
                        }
                }
                Comment.nesting = 1, Comment.offset = 60;

                function validation(obj) {
                    obj.redirect && (window.location = obj.redirect + window.location)
                }
                return Comment.prototype.like = function() {
                    return Q($.post(settings.path + "/like", {
                        id: this.id
                    })).then(function(res) {
                        return validation(res), res
                    })
                }, Comment.prototype.delete = function() {
                    return Q($.post(settings.path + "/delete", {
                        id: this.id
                    })).then(function(res) {
                        return validation(res), res
                    })
                }, Comment.new = function(itemId, comment) {
                    return Q($.post(settings.path + "/new", {
                        itemId: itemId,
                        comment: comment
                    })).then(function(cmt) {
                        return validation(cmt), new Comment(cmt)
                    })
                }, Comment.prototype.answer = function(comment) {
                    return Q($.post(settings.path + "/answer", {
                        toId: this.id,
                        comment: comment
                    })).then(function(cmt) {
                        return validation(cmt), new Comment(cmt)
                    })
                }, Comment
            }(),
            UIRepresenter = function() {
                function UIRepresenter() {}
                UIRepresenter.factory = function() {
                    return arguments ? 3 === arguments.length ? (markup = arguments[0], template = arguments[1], prefix = arguments[2], (parser = document.createElement("span")).innerHTML = markup.innerHTML, Inner(parser.getElementsByClassName(template)[0], prefix)) : 2 === arguments.length ? Inner(arguments[0], arguments[1]) : null : null;
                    var markup, template, prefix, parser
                };
                var parse = function(items, prefix) {
                    var self = this;
                    _(items).forEach(function(item) {
                        _(item.classList).forEach(function(className) {
                            self[className.replace(prefix + "__", "")] = item
                        }), parse.call(self, item.children, prefix)
                    })
                };

                function Inner(container, prefix) {
                    var self = new UIRepresenter;
                    return self.prefix = prefix, self.main = container, parse.call(self, container.children, prefix), self
                }
                return UIRepresenter.prototype.copy = function() {
                    return Inner(this.main.cloneNode(!0), this.prefix)
                }, UIRepresenter
            }(),
            doc = document,
            markup = doc.getElementById("comment"),
            id = markup.getAttribute("data-id"),
            activeCmt = UIRepresenter.factory(markup, "comment-active", "comment"),
            removedCmt = UIRepresenter.factory(markup, "comment-deleted", "comment"),
            input = UIRepresenter.factory(doc.getElementById("comment-input"), "comment-input", "comment-input"),
            newInput = UIRepresenter.factory(doc.getElementById("comment-input"), "comment-new", "comment-new"),
            deleterequest = UIRepresenter.factory(doc.getElementById("comment-delete-request"), "comment-delete-request", "comment-delete-request"),
            deleteexception = UIRepresenter.factory(doc.getElementById("comment-delete-request"), "comment-delete-exception", "comment-delete-exception"),
            placeholder = doc.getElementsByClassName("comments-placeholder")[0],
            reset = function() {
                placeholder.appendChild(input.main), newInput.main.parentNode && newInput.main.parentNode.removeChild(newInput.main), input.tocancel.classList.add("comment-input__tocancel_not-visible"), sendhandlers(function() {
                    var text = input.text__input.value;
                    text.trim() && (clearInput(), cl.new(text).then(rerender).then(reset))
                })
            },
            clearInput = function() {
                input.text__input.value = "", setupInputSettings()
            },
            setupInputSettings = function() {
                input.text__input.style.height = "1px", input.text__input.style.height = Math.max(100, 25 + input.text__input.scrollHeight) + "px", sendbuttonVisibility()
            },
            sendbuttonVisibility = function() {
                var btn = input.main.getElementsByClassName("button")[0],
                    indexOf = Array.prototype.indexOf,
                    value = input.text__input.value.trim();
                !value && 0 <= indexOf.call(btn.classList, "button_emerald-fullfill") ? btn.classList.add("button_emerald-fullfill_disabled") : value && 0 <= indexOf.call(btn.classList, "button_emerald-fullfill_disabled") && btn.classList.remove("button_emerald-fullfill_disabled")
            },
            cl = new CommentsList(id),
            title = new titledHr;
        cl.on("changeCount", function(count) {
            title.render(settings.title + " (" + count + ") ")
        }, !1), cl.on("renderComment", function(cmt, hr) {
            var comment, result = doc.createDocumentFragment();
            if (cmt.deleted) {
                if (!cmt.children.length || _.every(cmt.children, "deleted")) return null;
                comment = removedCmt.copy(), result.appendChild(comment.main)
            } else {
                var commentData = (comment = activeCmt.copy()).data,
                    self = this;
                comment.main.setAttribute("data-id", cmt.id), comment.main.setAttribute("data-level", hr), comment.nickname.classList.add("comment__nickname_lvl" + hr), comment.avatar.setAttribute("src", cmt.image), comment.nickname__link.innerHTML = cmt.nick, comment.nickname__link.setAttribute("href", cmt.authorurl), comment.date.innerHTML = cmt.date, comment.text.innerHTML = cmt.text.replace(/\n/g, "<br/>"), comment.tolike__count.innerHTML = cmt.likes,
                    function displayLike(already, count) {
                        comment.tolike__count.innerHTML = count, already ? (comment.tolike.classList.add("comment__tolike_already"), comment.tolike__checkmark.classList.add("comment__tolike__checkmark_visible"), comment.tolike__plus.classList.remove("comment__tolike__plus_visible"), comment.tolike = removeEventListeners(comment.tolike)) : (comment.tolike__plus.classList.add("comment__tolike__plus_visible"), comment.tolike.addEventListener("click", function() {
                            cl.like(cmt.id).then(function(c) {
                                displayLike(!0, c)
                            })
                        }, !1))
                    }(cmt.alreadyLike, cmt.likes), hr < Comment.nesting ? comment.toanswer.addEventListener("click", function(event) {
                        comment.main.parentNode.insertBefore(input.main, comment.main.nextSibling), placeholder.appendChild(newInput.main), input.tocancel.classList.remove("comment-input__tocancel_not-visible"), sendhandlers(function() {
                            var text = input.text__input.value;
                            text && (clearInput(), self.add(cmt.id, text).then(rerender))
                        }), input.tocancel = removeEventListeners(input.tocancel), input.tocancel.addEventListener("click", function(e) {
                            reset(), e.preventDefault()
                        }, !1), input.text__input.focus(), event.preventDefault()
                    }, !1) : comment.toanswer.parentElement.removeChild(comment.toanswer), cmt.candelete && (comment.todelete.addEventListener("click", function() {
                        _(doc.getElementsByClassName("comment__todelete")).forEach(function(item) {
                            item.classList.remove("comment__todelete_permanent-visible"), item.classList.remove("comment__todelete_visible")
                        }), deleteexception.main.parentNode && deleteexception.main.parentNode.removeChild(deleteexception.main), comment.todelete.classList.add("comment__todelete_permanent-visible"), commentData.appendChild(deleterequest.main), deleterequest.accept = removeEventListeners(deleterequest.accept), deleterequest.accept.addEventListener("click", function(e) {
                            self.delete(cmt.id).then(rerender, function(ex) {
                                deleterequest.main.parentNode.replaceChild(deleteexception.main, deleterequest.main)
                            }), e.preventDefault()
                        }, !1), deleterequest.cancel = removeEventListeners(deleterequest.cancel), deleterequest.cancel.addEventListener("click", function(e) {
                            comment.todelete.classList.remove("comment__todelete_permanent-visible"), comment.todelete.classList.remove("comment__todelete_visible"), commentData.removeChild(deleterequest.main), e.preventDefault()
                        }, !1)
                    }, !1), comment.main.addEventListener("mouseenter", function() {
                        comment.todelete.classList.add("comment__todelete_visible")
                    }, !1), comment.main.addEventListener("mouseleave", function() {
                        comment.todelete.classList.remove("comment__todelete_visible")
                    }, !1))
            }
            return result.appendChild(comment.main), comment.main.style.marginLeft = Comment.offset * (hr < Comment.nesting ? hr : Comment.nesting) + "px", result.appendChild(((hr = doc.createElement("hr")).classList.add("hr"), hr.classList.add("hr_margin"), hr)), result
        }), cl.load().then(function(response) {
            return cl.render(response)
        }).then(function(o) {
            placeholder.appendChild(o.dom), newInput.main.addEventListener("click", function(e) {
                reset(), input.text__input.focus(), e.preventDefault()
            }, !1), reset()
        })
    }
});
define("ForPartners/ForPartners", function() {
    var Slider = function() {
        function Slider(items, icons) {
            this.items = items || [], this.icons = icons, this.handlers = []
        }
        return Slider.prototype.on = function(key, handler) {
            this.handlers[key] || (this.handlers[key] = []), this.handlers[key].push(handler)
        }, Slider.prototype.start = function() {
            this.select(0)
        }, Slider.prototype.next = function() {
            var nextIndex = this.selected + 1;
            this.items.length === nextIndex && (nextIndex = 0), this.select(nextIndex)
        }, Slider.prototype.previous = function() {
            var prevIndex = this.selected - 1;
            prevIndex < 0 && (prevIndex = this.items.length - 1), this.select(prevIndex)
        }, Slider.prototype.select = function(index) {
            var that = this,
                sel = this.selected,
                self = this;
            void 0 !== sel && this.handlers.deselect.forEach(function(handler) {
                handler.call(self, self.items[sel], self.icons && self.icons[sel])
            }), this.selected = index, this.handlers.select.forEach(function(handler) {
                handler.call(that, that.items[index], that.icons && that.icons[index])
            })
        }, Slider.prototype.finish = function(index) {
            var that = this;
            this.handlers.finish.forEach(function(handler) {
                handler.call(that, that.items[index], that.icons && that.icons[index])
            })
        }, Slider
    }();
    return function() {
        for (var next = document, sliderElement = next.getElementsByClassName("promo-slider")[0], items = Array.prototype.slice.call(next.getElementsByClassName("promo-slider__slide")), icons = Array.prototype.slice.call(next.getElementsByClassName("for-partners__specials")), images = Array.prototype.slice.call(next.getElementsByClassName("for-partners__specials__logotype")), close = Array.prototype.slice.call(next.getElementsByClassName("promo-slider__slide__content__description__close")), previous = next.getElementsByClassName("promo-slider__arrows__box__item_prev")[0], next = next.getElementsByClassName("promo-slider__arrows__box__item_next")[0], slider = new Slider(items, images), index = 0, length = icons.length; index < length; index += 1) ! function(i) {
            icons[i].addEventListener("click", function() {
                slider.select(i)
            }, !1)
        }(index);
        for (index = 0, length = close.length; index < length; index += 1) close[index].addEventListener("click", function() {
            slider.finish()
        }, !1);
        previous && previous.addEventListener("click", function() {
            slider.previous()
        }, !1), next && next.addEventListener("click", function() {
            slider.next()
        }, !1), window.addEventListener("keydown", function(e) {
            var keyCode = e.keyCode;
            37 !== keyCode && 39 !== keyCode && 27 !== keyCode || e.preventDefault(), 37 === keyCode ? slider.previous() : 39 === keyCode ? slider.next() : 27 === keyCode && slider.finish()
        }, !1), sliderElement.addEventListener("click", function(e) {
            var target = e.target;
            if (!target.classList.contains("promo-slider__arrows__box__item")) {
                for (; target != this;) {
                    if (target.classList.contains("promo-slider__slide__content")) return;
                    target = target.parentNode
                }
                slider.finish()
            }
        }, !1), slider.on("deselect", function(item) {
            item && (item.classList.remove("promo-slider__slide_active"), item.classList.add("promo-slider__slide_hidden"))
        }), slider.on("select", function(item) {
            sliderElement.classList.contains("promo-slider_hidden") && (sliderElement.classList.remove("promo-slider_hidden"), sliderElement.classList.add("promo-slider_active")), item && (item.classList.add("promo-slider__slide_active"), item.classList.remove("promo-slider__slide_hidden"))
        }), slider.on("finish", function() {
            sliderElement.classList.remove("promo-slider_active"), sliderElement.classList.add("promo-slider_hidden")
        })
    }
});
define("Features/Features", function() {
    return function() {
        var doc = document,
            views = doc.getElementsByClassName("features__template"),
            enrollment = doc.getElementsByClassName("enrollment")[0];
        window.addEventListener("hashchange", function() {
                var i;
                for (enrollment && (enrollment.style.display = "#/parents" !== this.location.hash ? "none" : ""), i = views.length; i--;) views[i].classList.remove("features__template_active"), views[i].getAttribute("data-url") === this.location.hash && views[i].classList.add("features__template_active");
                scroll(0, 0)
            }, !1),
            function() {
                var event = doc.createEvent("Event");
                event.initEvent("hashchange", !0, !1), doc.documentElement.dispatchEvent(event);
                for (var tabs = document.getElementsByClassName("tabs-nav__item"), i = 0; i < tabs.length; i++) tabs[i].addEventListener("click", function() {
                    var enrolmentPanel = document.getElementsByClassName("enrollment");
                    "teachers" === this.getAttribute("data-label") ? enrolmentPanel.style.display = "none" : enrolmentPanel.style.display = ""
                }, !1)
            }()
    }
});
define("MostActiveFilter/MostActiveFilter", function() {
    return function() {
        var s = document.getElementsByClassName("most-active-filter__block__select")[0];
        s.addEventListener("change", function() {
            var url = this.options[this.selectedIndex].getAttribute("data-url");
            document.location.href !== url && (document.location.href = url)
        }), s.addEventListener("focus", function() {
            this.size = "6"
        }), s.addEventListener("blur", function() {
            this.size = "1"
        })
    }
});
define("NewsList/NewsList", ["NewsItem/NewsItem"], function(newsItem) {
    var NewsList = function() {
        function NewsList() {
            this.handlers = []
        }
        return NewsList.prototype.on = function(key, handler) {
            this.handlers[key] || (this.handlers[key] = []), this.handlers[key].push(handler)
        }, NewsList.prototype.addRange = function(news) {
            var that = this;
            this.handlers.addrange.forEach(function(handler) {
                handler.call(that, news)
            })
        }, NewsList
    }();
    return function(settings) {
        var doc, more, newsList, news, skip, item;
        settings && (doc = document, newsList = new NewsList, news = doc.getElementsByClassName("news-list__posts")[0], skip = settings.skip, item = new newsItem, doc.querySelector(".show-more") && doc.querySelector(".show-more").parentNode && doc.querySelector(".show-more").parentNode.parentNode && (more = doc.querySelector(".show-more").parentNode.parentNode), newsList.on("addrange", function(model) {
            for (var clone, fragment = document.createDocumentFragment(), i = 0, length = model.length; i < length; i += 1) clone = item.render(model[i]), fragment.appendChild(clone);
            news.insertBefore(fragment, more)
        }), more && more.addEventListener("click", function(query) {
            query.preventDefault();
            query = "?skip=" + skip;
            settings.condition && (query += "&condition=" + settings.condition), $.get(settings.asyncLoadUrl + query, function(data) {
                newsList.addRange(data.items), skip += data.items.length, data.nomore && more.classList.add("show-more_hidden")
            })
        }, !1))
    }
});
define("NewsItem/NewsItem", function() {
    return function() {
        var doc = document,
            newsitem = doc.getElementsByClassName("news-item ")[0];
        this.render = function(model) {
            var clone = newsitem.cloneNode(!0),
                titleAnchor = clone.getElementsByClassName("news-item__title")[0],
                date = clone.getElementsByClassName("news-item__date")[0],
                content = clone.getElementsByClassName("news-item__content")[0],
                text = clone.getElementsByClassName("news-item__text")[0],
                commentsCounter = clone.getElementsByClassName("news-item__comments-counter")[0],
                commentsCount = clone.getElementsByClassName("news-item__comments-count")[0],
                remove = content.getElementsByClassName("news-item__image"),
                img = content.getElementsByClassName("news-item__read-more")[0].cloneNode(!0),
                titleAnchor = titleAnchor.getElementsByClassName("link")[0];
            if (remove.length)
                for (var i = 0, length = remove.length; i < length; i += 1) content.removeChild(remove[i]);
            return titleAnchor.innerHTML = model.Title, titleAnchor.setAttribute("href", model.Url), commentsCount && commentsCounter && (commentsCounter.setAttribute("href", model.Url), commentsCount.innerHTML = model.CommentsCount), date.innerHTML = model.Date, text.innerHTML = model.Summary + " ", img.setAttribute("href", model.Url), text.appendChild(img), model.HasImage && ((img = doc.createElement("img")).setAttribute("src", model.ImageHref), img.classList.add("news-item__image"), content.insertBefore(img, text)), model.IsLast && clone.classList.add("news-item_last"), clone
        }
    }
});
define("Slider/Slider", function() {
    var Slider = function() {
        function Slider(items, icons) {
            this.items = items || [], this.icons = icons, this.handlers = []
        }
        return Slider.prototype.on = function(key, handler) {
            this.handlers[key] || (this.handlers[key] = []), this.handlers[key].push(handler)
        }, Slider.prototype.start = function() {
            this.select(0)
        }, Slider.prototype.next = function() {
            var nextIndex = this.selected + 1;
            this.items.length === nextIndex && (nextIndex = 0), this.select(nextIndex)
        }, Slider.prototype.previous = function() {
            var prevIndex = this.selected - 1;
            prevIndex < 0 && (prevIndex = this.items.length - 1), this.select(prevIndex)
        }, Slider.prototype.select = function(index) {
            var that = this,
                sel = this.selected,
                self = this;
            void 0 !== sel && this.handlers.deselect.forEach(function(handler) {
                handler.call(self, self.items[sel], self.icons && self.icons[sel])
            }), this.selected = index, this.handlers.select.forEach(function(handler) {
                handler.call(that, that.items[index], that.icons && that.icons[index])
            })
        }, Slider
    }();
    return function() {
        for (var intervalId, next = document, tag = next.getElementsByClassName("slider")[0], items = Array.prototype.slice.call(next.getElementsByClassName("slider__item")), icons = Array.prototype.slice.call(next.getElementsByClassName("slider__icons__item")), images = Array.prototype.slice.call(next.getElementsByClassName("slider__icons__item__image")), previous = next.getElementsByClassName("slider__arrows__item_prev")[0], next = next.getElementsByClassName("slider__arrows__item_next")[0], slider = new Slider(items, images), resetTimer = function(onlyClear) {
                window.clearInterval(intervalId), onlyClear || (intervalId = window.setInterval(function() {
                    slider.next()
                }, 15e3))
            }, index = 0, length = icons.length; index < length; index += 1) ! function(i) {
            icons[i].addEventListener("click", function() {
                slider.select(i)
            }, !1)
        }(index);
        previous && previous.addEventListener("click", function() {
            slider.previous(), resetTimer()
        }, !1), next && next.addEventListener("click", function() {
            slider.next(), resetTimer()
        }, !1), window.addEventListener("keydown", function(e) {
            var keyCode = e.keyCode;
            37 !== keyCode && 39 !== keyCode || e.preventDefault(), 37 === keyCode ? slider.previous() : 39 === keyCode && slider.next()
        }, !1), tag.addEventListener("mouseenter", function() {
            resetTimer(!0)
        }), tag.addEventListener("mouseleave", function() {
            resetTimer()
        }), slider.on("deselect", function(item, icon) {
            item && (item.classList.remove("slider__item_active"), item.classList.add("slider__item_hidden")), icon && (icon.classList.remove("slider__icons__item__image_active"), icon.nextElementSibling.classList.remove("slider__icons__item__label_active"))
        }), slider.on("select", function(item, icon) {
            item && (item.classList.add("slider__item_active"), item.classList.remove("slider__item_hidden")), icon && (icon.classList.add("slider__icons__item__image_active"), icon.nextElementSibling.classList.add("slider__icons__item__label_active"))
        }), slider.start(), resetTimer()
    }
});
define("SchoolSelector/SchoolSelector", function() {
    return function() {
        var mouseOnList, options = document.getElementsByClassName("school-selector")[0],
            select = options.getElementsByClassName("school-selector__wrapper")[0],
            list = options.getElementsByClassName("schools-list")[0],
            options = list.getElementsByClassName("schools-list__item"),
            optionHandler = function() {
                var url = this.getAttribute("data-url");
                list.classList.remove("select-list_active"), document.location.href = url
            };
        select.addEventListener("click", function() {
            list.classList.toggle("schools-list_active"), select.focus()
        }), list.addEventListener("mouseover", function(e) {
            mouseOnList = !0
        }), list.addEventListener("mouseout", function(e) {
            mouseOnList = !1
        }), select.addEventListener("blur", function(e) {
            mouseOnList ? (e.preventDefault(), e.stopPropagation(), select.focus()) : list.classList.remove("schools-list_active")
        }), _.each(options, function(element) {
            element.addEventListener("click", optionHandler)
        })
    }
});
define("PaymentSuccessful/PaymentSuccessful", ["analytics/google"], function(ga) {
    "use strict";
    return function(analyticsEvent) {
        analyticsEvent = analyticsEvent.analyticsEvent;
        analyticsEvent && ga.track({
            category: analyticsEvent.category,
            action: analyticsEvent.action,
            label: analyticsEvent.label,
            value: analyticsEvent.value
        }), ga.trackUrl({
            pageView: "paysuccess"
        })
    }
});
define("AddEmail/AddEmail", ["../../modules/utils/ajax-request-manager"], function(AjaxManager) {
    "use strict";
    var ajaxManager = new AjaxManager;
    return function(model) {
        function applyValidation(e, data) {
            !data.IsValid && data.Error ? (e.classList.remove("yellow-hint_hidden"), data.Error && (e.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = data.Error)) : e && !e.classList.contains("yellow-hint_hidden") && e.classList.add("yellow-hint_hidden")
        }

        function submit(request) {
            request = $.post(addEmailUrl, {
                email: request
            }, function(data) {
                data.success ? window.location.href = returnUrl : applyValidation(emailHint, {
                    IsValid: !1,
                    Error: data.error
                })
            }, "json"), ajaxManager.addRequest(request)
        }
        var submitButton = model.generatedId,
            submitButton = document.getElementById(submitButton),
            emailInput = submitButton.querySelector(".input_email"),
            emailHint = submitButton.querySelector(".yellow-hint_email-hint"),
            submitButton = submitButton.querySelector(".element-button_submit-button"),
            addEmailUrl = model.addEmailUrl,
            emailValidationUrl = model.emailValidationUrl,
            returnUrl = model.returnUrl;
        emailInput.addEventListener("input", function(e) {
            ! function(request) {
                request = $.post(emailValidationUrl, {
                    email: request
                }, function(data) {
                    applyValidation(emailHint, data)
                }, "json");
                ajaxManager.addRequest(request)
            }(this.value)
        }), emailInput.addEventListener("keydown", function(e) {
            13 === e.keyCode && submit(this.value)
        }), submitButton.addEventListener("click", function(e) {
            submit(emailInput.value)
        })
    }
});
define("ContingentDataLoadStep/ContingentDataLoadStep", ["async/polling"], function(polling) {
    "use strict";
    return function(model) {
        var preloader = document.getElementsByClassName("preloader")[0],
            button = document.getElementsByClassName("button")[0],
            popup = document.getElementsByClassName("popup_hidden")[0],
            stateHandlerUrl = model.stateHandlerUrl,
            contingentSchoolGuid = model.contingentSchoolGuid,
            finishStepUrl = model.finishStepUrl,
            loadContingentDataUrl = model.loadContingentDataUrl;

        function showErrorPopup() {
            popup.classList.remove("popup_hidden"), popup.classList.add("popup_active"), preloader.classList.remove("preloader_active"), button.classList.remove("button_hide")
        }

        function pollingError(e) {
            e.status !== polling.status.TASK_STATUS_UNDEFINED && polling.cancel(), showErrorPopup()
        }

        function pollingSuccess() {
            polling.cancel(), window.location.href = finishStepUrl
        }
        button.addEventListener("click", function(e) {
            e.preventDefault(), preloader.classList.add("preloader_active"), e.target.classList.add("button_hide"), $.ajax({
                url: loadContingentDataUrl,
                dataType: "json",
                type: "POST",
                data: {
                    schoolGuid: contingentSchoolGuid
                },
                success: function(data) {
                    ! function(taskId) {
                        setTimeout(function() {
                            polling.start({
                                taskID: taskId,
                                taskStateHandlerUrl: stateHandlerUrl,
                                success: pollingSuccess,
                                error: pollingError
                            })
                        }, 1e3)
                    }(data.taskId)
                },
                error: showErrorPopup
            })
        })
    }
});
define("CredentialsRecoveryStep1/CredentialsRecoveryStep1", function() {
    return function() {
        for (var doc = document, labelWithRadio = doc.getElementsByClassName("radio-button"), contentPartForms = doc.getElementsByClassName("step1__content__form"), triggerView = function(selectedContentPart) {
                for (var selectedContentPartForm = selectedContentPart.getElementsByClassName("step1__content__form")[0], j = 0; j < contentPartForms.length; j++) {
                    var contentFormForTrigger = contentPartForms[j];
                    contentFormForTrigger.classList.contains("step1__content__form_hidden") || contentFormForTrigger.classList.add("step1__content__form_hidden"), selectedContentPartForm.classList.remove("step1__content__form_hidden")
                }
            }, triggerLabels = function(selectedLabel) {
                for (var i = 0, len = labelWithRadio.length; i < len; i++) {
                    var greyLabel = labelWithRadio[i];
                    greyLabel.classList.contains("radio-button_grey") || greyLabel.classList.add("radio-button_grey")
                }
                selectedLabel.classList.remove("radio-button_grey")
            }, j = 0, l = labelWithRadio.length; j < l; j++) {
            var label = labelWithRadio[j];
            label.classList.contains("radio-button_checked") && (triggerLabels(label), triggerView(label.parentNode)), label.addEventListener("click", function() {
                triggerLabels(this), triggerView(this.parentNode)
            }, !1)
        }
    }
});
define("CredentialsRecoverySecurityQuestionStep/CredentialsRecoverySecurityQuestionStep", function() {
    return function() {
        var doc = document,
            answerInput = doc.getElementsByClassName("input_answer-validation")[0],
            answerHint = doc.getElementsByClassName("yellow-hint_answer-hint")[0];
        answerInput.addEventListener("input", function() {
            ! function(input, hint) {
                input.value ? (function(e) {
                    e.classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden")
                }(hint), input.classList.remove("input_with-message")) : (input.classList.add("input_with-message"), function(e, msg) {
                    {
                        e.classList.remove("yellow-hint_hidden"), msg && (e.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = msg)
                    }
                }(hint))
            }(answerInput, answerHint)
        })
    }
});
define("CredentialsRecoveryStep3Email/CredentialsRecoveryStep3Email", ["smsRecoveryTracker"], function(tracker) {
    tracker.send("get_email")
});
define("CredentialsRecoveryStep3Sms/CredentialsRecoveryStep3Sms", ["utils/toggleTimer"], function(toggleTimer) {
    return function(model) {
        var doc = document,
            answerInput = doc.getElementsByClassName("input_answer-validation")[0],
            answerHint = doc.getElementsByClassName("yellow-hint_answer-hint")[0];

        function showError(e, msg) {
            e.classList.remove("yellow-hint_hidden"), msg && (e.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = msg)
        }

        function hideError(e) {
            e.classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden")
        }
        answerInput.addEventListener("input", function() {
            ! function(input, hint) {
                input.value ? (hideError(hint), input.classList.remove("input_with-message")) : (input.classList.add("input_with-message"), showError(hint))
            }(answerInput, answerHint)
        }), 0 < model.messageId && setTimeout(function() {
            $.ajax({
                type: "GET",
                datatype: "json",
                url: model.baseUrl + "/api/smsvalidation/" + model.messageId + "/status",
                success: function(data) {
                    data.error && showError(answerHint, data.error)
                }
            })
        }, model.timerDuration / 2 * 1e3), model.isSmsRepeaterEnabled && toggleTimer({
            timerContainer: document.getElementById(model.timerContainerId),
            hideElement: document.getElementById(model.sendSmsButtonId),
            hideClassName: "sms-repeater_item-hidden",
            timerDuration: model.timerDuration,
            timerTextTemplate: model.timerTextTemplate,
            runImmediately: !0,
            onClick: function(e, runTimer) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: model.repeatCodeUrl,
                    error: function() {
                        showError(answerHint, model.unexpectedError)
                    },
                    success: function(data) {
                        hideError(answerHint), data.success ? runTimer() : data.error ? showError(answerHint, data.error) : showError(answerHint, model.unexpectedError)
                    }
                })
            },
            callback: function() {
                showError(answerHint, model.smsHintMessage)
            }
        })
    }
});
define("CredentialsRecoveryStep2/CredentialsRecoveryStep2", function() {
    return function(model) {
        for (var doc = document, labelWithRadio = doc.getElementsByClassName("radio-button"), form = doc.getElementsByClassName("credentials-recovery-step2")[0], triggerAction = function(selectedRadio) {
                "sms" === selectedRadio.value ? form.action = model.phoneAction : form.action = model.emailAction
            }, j = 0, l = labelWithRadio.length; j < l; j++) {
            labelWithRadio[j].addEventListener("click", function() {
                var selectedRadio;
                this.classList.contains("radio-button_checked") && (selectedRadio = this.getElementsByClassName("radio-button__input")[0], triggerAction(selectedRadio))
            }, !1)
        }
    }
});
define("EsiaPersonSelector/EsiaPersonSelector", function() {
    "use strict";
    return {
        select: function(personId) {
            $(".esia-person-selector_form input[name=PersonId]").val(personId), $("form").submit()
        }
    }
});
define("CredentialsStep/CredentialsStep", ["../../modules/utils/ajax-request-manager", "ChangePassword/ChangePassword"], function(AjaxManager, ChangePassword) {
    "use strict";
    var ajxManager = new AjaxManager;
    return function(model) {
        var login, loginHint, submit = document.getElementsByClassName("finish-submit")[0],
            agreeHint = document.getElementsByClassName("yellow-hint_agreement-hint")[0],
            needValidateLogin = model.needValidateLogin,
            agreeWrapper = document.getElementById(model.agreeWrapperId),
            loginValidationUrl = model.loginValidationUrl,
            isLoginValid = model.isLoginValid,
            changePass = new ChangePassword(model);

        function isCorrect(value, hint) {
            return value ? (hideError(hint), !0) : (showError(hint), !1)
        }

        function validateAgreement() {
            var val = document.getElementsByClassName("checkbox-value")[0].value;
            return isCorrect("True" === val || "true" === val, agreeHint)
        }

        function showError(e, msg) {
            e.classList.remove("yellow-hint_hidden"), msg && (e.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = msg)
        }

        function hideError(e) {
            e.classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden")
        }
        submit.addEventListener("click", function(isValid) {
            isValid.preventDefault();
            isValid = validateAgreement();
            (isValid = (!needValidateLogin || isCorrect(isLoginValid, loginHint)) && isValid) && (submit.setAttribute("disabled", "disabled"), document.forms[0].submit())
        }, !1), agreeWrapper.addEventListener("click", function(e) {
            validateAgreement()
        }), needValidateLogin && (login = document.getElementsByClassName("input_login-validation")[0], loginHint = document.getElementsByClassName("yellow-hint_login")[0], login.addEventListener("input", function(e) {
            changePass.setLogin(this.value);
            var request = $.post(loginValidationUrl, {
                login: encodeURIComponent(this.value)
            }, function(data) {
                changePass.check(), data.IsValid ? login.classList.contains("input_correctly") || (login.classList.add("input_correctly"), isLoginValid = !0, hideError(loginHint)) : (login.classList.remove("input_correctly"), isLoginValid = !1, showError(loginHint, data.Error))
            }, "json");
            ajxManager.addRequest(request)
        }))
    }
});
define("EsiaAuthProcessingProgress/EsiaAuthProcessingProgress", ["async/polling"], function(polling) {
    "use strict";
    return function(model) {
        var stateHandlerUrl = model.stateHandlerUrl,
            processingResultRedirectUrl = model.processingResultRedirectUrl;

        function pollingCompleted() {
            polling.cancel(), window.location.href = processingResultRedirectUrl
        }! function(taskId) {
            setTimeout(function() {
                polling.start({
                    taskID: taskId,
                    taskStateHandlerUrl: stateHandlerUrl,
                    success: pollingCompleted,
                    error: pollingCompleted
                })
            }, 1e3)
        }(model.taskId)
    }
});
define("EsiaPersonSelectorItem/EsiaPersonSelectorItem", ["EsiaPersonSelector/EsiaPersonSelector"], function(selector) {
    return function(model) {
        "use strict";
        $("#" + model.itemKey + " .esia-person-selector_link").click(function() {
            var personId = $("#" + model.itemKey + " input[name=PersonId]").val();
            selector.select(personId)
        })
    }
});
define("ForgotLogin/ForgotLogin", function() {
    "use strict";
    return function(model) {
        var captchaInput, captchaHint, captchaWrapper = model.id,
            doc = document,
            form = doc.getElementById(captchaWrapper),
            captchaWrapper = doc.getElementById(model.captchaWrapperId),
            emailInput = form.getElementsByClassName("input_email-validation")[0],
            phoneInput = form.getElementsByClassName("input_phone-validation")[0],
            dayWrapper = doc.getElementById(model.dayWrapperId),
            monthWrapper = doc.getElementById(model.monthWrapperId),
            yearWrapper = doc.getElementById(model.yearWrapperId),
            birthdayHint = form.getElementsByClassName("yellow-hint_birthday-hint")[0],
            emailOrPhoneHint = form.getElementsByClassName("yellow-hint_email-or-phone-hint")[0],
            linkDiv = form.querySelector(".forgot-login__link"),
            phoneDiv = form.querySelector(".forgot-login__phone");

        function getSelectedValue(s) {
            return s.getElementsByClassName("select-value")[0].value
        }

        function checkEmailOrPhone() {
            if (emailInput.value || phoneInput && " " !== phoneInput.value[model.firstPhoneDigitIndex]) return emailInput.classList.remove("input_with-message"), phoneInput && phoneInput.classList.remove("input_with-message"), emailOrPhoneHint.classList.add("yellow-hint_hidden"), 1;
            emailInput.classList.add("input_with-message"), phoneInput && phoneInput.classList.add("input_with-message"), emailOrPhoneHint.classList.remove("yellow-hint_hidden")
        }

        function hideError(e) {
            e.classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden")
        }
        emailInput.addEventListener("input", function() {
            checkEmailOrPhone()
        }), phoneInput && phoneInput.addEventListener("input", function() {
            checkEmailOrPhone()
        }), dayWrapper.change = monthWrapper.change = yearWrapper.change = function() {
            var day, month, year;
            day = getSelectedValue(dayWrapper), month = getSelectedValue(monthWrapper), year = getSelectedValue(yearWrapper), day && month && year && hideError(birthdayHint)
        }, captchaWrapper && (captchaInput = captchaWrapper.querySelector(".input_captcha-validation"), captchaHint = form.querySelector(".yellow-hint_captcha-hint"), captchaInput.addEventListener("input", function() {
            this.value && (captchaInput.classList.remove("input_with-message"), hideError(captchaHint))
        })), linkDiv && linkDiv.addEventListener("click", function(e) {
            e.preventDefault(), linkDiv.classList.add("forgot-login_item-hidden"), phoneDiv.classList.remove("forgot-login_item-hidden")
        })
    }
});
define("KzCspAuthorization/KzCspAuthorization", function() {
    "use strict";
    return function(model) {
        var root = document.getElementById(model.id),
            selectCertificateButton = root.querySelector(".kz-csp-authorization__button"),
            messageContainer = root.querySelector(".kz-csp-authorization__hint"),
            loader = root.querySelector(".preloader"),
            webSocket = new WebSocket("wss://127.0.0.1:13579/"),
            callback = null,
            showMessage = function(message) {
                messageContainer.classList.remove("kz-csp-authorization__hint_hidden"), messageContainer.children[0].innerHTML = message
            };

        function sendToken(token) {
            showLoader(), $.ajax({
                type: "POST",
                url: model.authorizeUrl,
                dataType: "json",
                data: {
                    token: token,
                    returnUrl: model.returnUrl
                },
                async: !0,
                success: function(data) {
                    data.error && (showMessage(data.error), hideLoader()), data.returnUrl && window.location.replace(data.returnUrl)
                },
                error: function() {
                    showMessage(model.commonErrorMessage), hideLoader()
                }
            })
        }

        function showLoader() {
            selectCertificateButton.classList.add("kz-csp-authorization__button_hidden"), loader.classList.add("preloader_active")
        }

        function hideLoader() {
            selectCertificateButton.classList.remove("kz-csp-authorization__button_hidden"), loader.classList.remove("preloader_active")
        }

        function createCMSSignatureFromBase64Back(result) {
            "200" === result.code && sendToken(result.responseObject)
        }

        function createCMSSignatureFromBase64(storageName, keyType, base64ToSign, createCMSSignatureFromBase64, callBack) {
            createCMSSignatureFromBase64 = {
                module: "kz.gov.pki.knca.commonUtils",
                method: "createCMSSignatureFromBase64",
                args: [storageName, keyType, base64ToSign, createCMSSignatureFromBase64]
            };
            callback = callBack, webSocket.send(JSON.stringify(createCMSSignatureFromBase64))
        }

        function createCMSSignatureFromBase64Call() {
            var base64ToSign = model.token;
            null !== base64ToSign && "" !== base64ToSign ? createCMSSignatureFromBase64("PKCS12", "AUTH", base64ToSign, !0, createCMSSignatureFromBase64Back) : showMessage("Нет данных для подписи!")
        }
        webSocket.onopen = function(event) {
            console.log("Connection opened")
        }, webSocket.onclose = function(event) {
            event.wasClean ? console.log("Connection has been closed") : (console.log("Connection error"), showMessage(model.errorMessageNoApp)), console.log("Code: " + event.code + " Reason: " + event.reason)
        }, webSocket.onmessage = function(event) {
            var result = JSON.parse(event.data),
                rw;
            null != result && (rw = {
                code: result.code,
                message: result.message,
                responseObject: result.responseObject,
                getResult: function() {
                    return this.result
                },
                getMessage: function() {
                    return this.message
                },
                getResponseObject: function() {
                    return this.responseObject
                },
                getCode: function() {
                    return this.code
                }
            }, null != callback && eval(callback)(rw))
        }, selectCertificateButton.addEventListener("click", createCMSSignatureFromBase64Call)
    }
});
define("Inn/Inn", ["../../modules/utils/ajax-request-manager", "utils/forcenumberinput"], function(AjaxManager) {
    "use strict";
    var ajaxManager = new AjaxManager;
    return function(model) {
        var innInput = document.querySelector(".input_inn-validation"),
            innHint = document.querySelector(".yellow-hint_inn"),
            innValidationUrl = model.innValidationUrl,
            orgStructSelectWrapper = document.getElementById(model.orgStructId),
            schoolId = model.schoolId;
        innInput && innHint && innInput.addEventListener("blur", function() {
            ! function(inn, schoolId, request) {
                request = $.post(innValidationUrl, {
                    inn: inn,
                    schoolId: schoolId,
                    orgStruct: request
                }, function(data) {
                    ! function(e, data) {
                        !data.IsValid && data.Error ? (e.classList.remove("yellow-hint_hidden"), data.Error && (e.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = data.Error)) : e && !e.classList.contains("yellow-hint_hidden") && e.classList.add("yellow-hint_hidden")
                    }(innHint, data)
                }, "json");
                ajaxManager.addRequest(request)
            }(this.value, schoolId, orgStructSelectWrapper.getElementsByClassName("select-value")[0].value)
        })
    }
});
define("Login/Login", function() {
    "use strict";
    return function(showFormButton) {
        function changeMessageVisibility(input, hint, isInputEmpty) {
            isInputEmpty ? (hint.classList.remove("login__body__hint_hidden"), input.classList.add("input_with-message")) : (hint.classList.add("login__body__hint_hidden"), input.classList.remove("input_with-message"))
        }
        var toggleLoginFormVisibility = document,
            backButton = toggleLoginFormVisibility.getElementById(showFormButton.captchaWrapperId),
            captchaInput = backButton && backButton.getElementsByClassName("input_captcha-validation")[0],
            captchaHint = toggleLoginFormVisibility.getElementsByClassName("yellow-hint_captcha-hint")[0],
            login = toggleLoginFormVisibility.getElementsByClassName("login__body__input_login")[0],
            password = toggleLoginFormVisibility.getElementsByClassName("login__body__input_password")[0],
            loginHint = toggleLoginFormVisibility.getElementsByClassName("login__body__hint_login")[0],
            passwordHint = toggleLoginFormVisibility.getElementsByClassName("login__body__hint_password")[0],
            showFormButton = toggleLoginFormVisibility.getElementsByClassName("button_show-form-btn")[0],
            hiddenFormFields = toggleLoginFormVisibility.querySelectorAll(".login__form-hidden"),
            shownFormFields = toggleLoginFormVisibility.querySelectorAll(".login__form_shown"),
            backButton = (toggleLoginFormVisibility.getElementsByClassName("login")[0], toggleLoginFormVisibility.getElementsByClassName("login__back-btn")[0]),
            formErrorHint = toggleLoginFormVisibility.getElementsByClassName("login__body__hint_error-message"),
            toggleLoginFormVisibility = function() {
                var formFields = hiddenFormFields.length ? hiddenFormFields : shownFormFields;
                formFields && [].forEach.call(formFields, function(item, i) {
                    item.classList.toggle("login__form-hidden"), item.classList.toggle("login__form_shown")
                })
            };
        showFormButton && showFormButton.addEventListener("click", toggleLoginFormVisibility), backButton && (backButton.addEventListener("click", toggleLoginFormVisibility), formErrorHint && backButton.addEventListener("click", function() {
            [].forEach.call(formErrorHint, function(item, i) {
                item.classList.add("login__body__hint_hidden")
            })
        })), login && login.addEventListener("input", function() {
            changeMessageVisibility(login, loginHint, !login.value)
        }, !1), password && password.addEventListener("input", function() {
            changeMessageVisibility(password, passwordHint, !password.value)
        }, !1), captchaInput && captchaInput.addEventListener("input", function() {
            this.value && (captchaInput.classList.remove("input_with-message"), captchaHint.classList.contains("yellow-hint_hidden") || captchaHint.classList.add("yellow-hint_hidden"))
        })
    }
});
define("LoginErrorPopup/LoginErrorPopup", function() {
    "use strict";
    return function(model) {
        document.getElementsByClassName("close-popup")[0].addEventListener("click", function(popup) {
            popup.preventDefault();
            popup = document.getElementsByClassName("login-error-popup_active")[0];
            popup.classList.remove("login-error-popup_active"), popup.classList.add("login-error-popup_hidden")
        })
    }
});
define("ForgotPassword/ForgotPassword", function() {
    "use strict";
    return function(captchaWrapper) {
        var captchaInput, captchaHint, form = captchaWrapper.id,
            doc = document,
            form = doc.getElementById(form),
            captchaWrapper = doc.getElementById(captchaWrapper.captchaWrapperId),
            loginInput = form.getElementsByClassName("input_login-validation")[0],
            loginHint = form.getElementsByClassName("yellow-hint_login-hint")[0];

        function hideError(e) {
            e.classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden")
        }
        loginInput.addEventListener("input", function() {
            ! function(input, hint) {
                input.value ? (hideError(hint), input.classList.remove("input_with-message")) : (input.classList.add("input_with-message"), function(e, msg) {
                    {
                        e.classList.remove("yellow-hint_hidden"), msg && (e.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = msg)
                    }
                }(hint))
            }(loginInput, loginHint)
        }), captchaWrapper && (captchaInput = captchaWrapper.querySelector(".input_captcha-validation"), captchaHint = form.querySelector(".yellow-hint_captcha-hint"), captchaInput.addEventListener("input", function() {
            this.value && (captchaInput.classList.remove("input_with-message"), hideError(captchaHint))
        }))
    }
});
define("RecommendDnevnik/RecommendDnevnik", function() {
    return function(model) {
        var updateView, captchaInput, captchaHint, doc = document,
            captchaWrapper = doc.getElementById(model.captchaWrapperId),
            fioInput = doc.getElementsByClassName("input_fio-validation")[0],
            emailInput = doc.getElementsByClassName("input_email-validation")[0],
            commentInput = doc.getElementsByClassName("textarea_comment-validation")[0],
            fioHint = doc.getElementsByClassName("yellow-hint_fio-hint")[0],
            emailHint = doc.getElementsByClassName("yellow-hint_email-hint")[0],
            commentHint = doc.getElementsByClassName("yellow-hint_comment-hint")[0],
            sendLink = doc.getElementsByClassName("recommend-dnevnik__link")[0],
            form = doc.getElementsByClassName("recommend-dnevnik__form")[0];

        function showError(e, msg) {
            e.classList.remove("yellow-hint_hidden"), msg && (e.getElementsByClassName("yellow-hint__wrapper")[0].textContent = msg)
        }

        function hideError(e) {
            e.classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden")
        }
        sendLink.addEventListener("click", function() {
            form.classList.remove("recommend-dnevnik__form_hidden")
        }), captchaWrapper && (captchaInput = captchaWrapper.querySelector(".input_captcha-validation"), captchaHint = doc.querySelector(".yellow-hint_captcha-hint"), captchaInput.addEventListener("input", function() {
            this.value && (captchaInput.classList.remove("input_with-message"), hideError(captchaHint))
        })), emailInput.addEventListener("input", function() {
            Q($.ajax({
                url: model.emailValidationUrl,
                type: "POST",
                data: {
                    value: emailInput.value
                }
            })).then(updateView)
        }), updateView = function(data) {
            data.IsValid ? (emailInput.classList.remove("input_with-message"), hideError(emailHint)) : (emailInput.classList.add("input_with-message"), showError(emailHint, data.Error))
        }, fioInput.addEventListener("input", function() {
            return hint = fioHint, (input = fioInput).value ? (hideError(hint), input.classList.remove("input_with-message"), !0) : (input.classList.add("input_with-message"), showError(hint), !1);
            var input, hint
        }), commentInput.addEventListener("input", function() {
            return commentInput.value ? (hideError(commentHint), commentInput.classList.remove("textarea_with-message"), !0) : (commentInput.classList.add("textarea_with-message"), showError(commentHint), !1)
        })
    }
});
define("RegionPopup/RegionPopup", function() {
    "use strict";
    return function(regionInput) {
        var regions, changeRegionButton = document.getElementsByClassName(regionInput.changeRegionButtonClassName)[0],
            regionPopupCloseBtn = document.getElementById(regionInput.regionPopupCancelIconId),
            regionPopupWrapper = document.getElementById(regionInput.regionPopupWrapperId),
            regionListWrapper = document.getElementById(regionInput.regionPopupListWrapperId),
            regionItems = document.getElementsByClassName(regionInput.regionPopupListItemClassName),
            regionInput = document.getElementById(regionInput.regionInputId),
            hiddenClassName = "region-popup__wrapper_hidden";

        function updateRegionList(e) {
            var input, reg, dataArray, ul, relevantRegions = (input = this.value, reg = new RegExp(input.trim(), "i"), regions.filter(function(region) {
                if (region.text.match(reg)) return region
            }));
            regionListWrapper.innerHTML = (dataArray = relevantRegions, (ul = document.createElement("ul")).classList.add("region-popup__list"), dataArray.forEach(function(item) {
                var li = document.createElement("li"),
                    a = document.createElement("a");
                a.textContent = item.text, a.href = item.href, li.classList.add("region-popup__list-item"), li.appendChild(a), ul.appendChild(li)
            }), ul.outerHTML)
        }

        function toggleRegionPopup(e) {
            var popupClasses = regionPopupWrapper.classList,
                popupEvents = {
                    add: function() {
                        regionPopupCloseBtn.addEventListener("click", handleClosePopup), regionPopupCloseBtn.addEventListener("keypress", handleClosePopupByPressingEnter), regionPopupWrapper.addEventListener("click", handleClosePopup)
                    },
                    remove: function() {
                        regionPopupWrapper.removeEventListener("click", handleClosePopup), regionPopupCloseBtn.removeEventListener("click", handleClosePopup), regionPopupCloseBtn.removeEventListener("keypress", handleClosePopupByPressingEnter)
                    }
                };

            function handleClosePopupByPressingEnter(e) {
                "Enter" === e.key && handleClosePopup(e)
            }

            function handleClosePopup(e) {
                e.target !== regionPopupWrapper && e.target !== regionPopupCloseBtn || (popupEvents.remove(), popupClasses.add(hiddenClassName))
            }
            e.target === regionPopupCloseBtn ? popupEvents.remove() : popupClasses.contains(hiddenClassName) && popupEvents.add(), popupClasses.toggle(hiddenClassName)
        }

        function toggleRegionPopupByPressingEnter(e) {
            "Enter" === e.key && toggleRegionPopup(e)
        }
        regionItems && (regions = [].map.call(regionItems, function(item, i) {
            return {
                text: item.textContent,
                href: item.firstChild.getAttribute("href")
            }
        }), updateRegionList.bind(null, regions)), changeRegionButton && (changeRegionButton.addEventListener("click", toggleRegionPopup), changeRegionButton.addEventListener("keypress", toggleRegionPopupByPressingEnter)), regionInput && (regionInput.addEventListener("input", updateRegionList), regionPopupCloseBtn.addEventListener("click", toggleRegionPopup), regionPopupCloseBtn.addEventListener("keypress", toggleRegionPopupByPressingEnter))
    }
});
define("SchoolActivationStep1/SchoolActivationStep1", function() {
    "use strict";

    function hideError(e) {
        e.classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden")
    }
    return function(model) {
        var classesSelectWrapper, classesSelectHint, classesDiv, typeSelectWrapper = document.getElementById(model.typeId),
            typeSelectHint = document.getElementsByClassName("yellow-hint_org-type")[0],
            formSelectWrapper = document.getElementById(model.orgFormId),
            formSelectHint = document.getElementsByClassName("yellow-hint_org-form")[0],
            submitButton = document.getElementsByClassName("submit-button")[0],
            name = document.getElementsByClassName("input_short-name-validation")[0],
            nameHint = document.getElementsByClassName("yellow-hint_short-name")[0],
            fullName = document.getElementsByClassName("input_full-name-validation")[0],
            fullNameHint = document.getElementsByClassName("yellow-hint_full-name")[0];

        function isCorrect(value, hint) {
            return value ? (hideError(hint), !0) : (function(e, msg) {
                {
                    e.classList.remove("yellow-hint_hidden"), msg && (e.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = msg)
                }
            }(hint), !1)
        }

        function getSelectedValue(s) {
            return s.getElementsByClassName("select-value")[0].value
        }
        model.isOoViewEnabled && (classesSelectWrapper = document.getElementById(model.classesId), classesSelectHint = document.getElementsByClassName("yellow-hint_org-class")[0], classesDiv = document.querySelector(".step1__org-class-row"), classesSelectWrapper && (classesSelectWrapper.change = function(selected) {
            selected && hideError(classesSelectHint)
        })), submitButton.addEventListener("click", function(isValid) {
            isValid.preventDefault();
            isValid = isCorrect(name.value, nameHint), isValid = isCorrect(fullName.value, fullNameHint) && isValid;
            (isValid = function() {
                var isValid = (!formSelectWrapper || isCorrect(getSelectedValue(formSelectWrapper), formSelectHint)) && isCorrect(getSelectedValue(typeSelectWrapper), typeSelectHint);
                return (!model.isOoViewEnabled || classesDiv.classList.contains("step1__org-class-row_hidden") || isCorrect(getSelectedValue(classesSelectWrapper), classesSelectHint)) && isValid
            }() && isValid) && document.forms[0].submit()
        }), typeSelectWrapper.change = function(val) {
            val && hideError(typeSelectHint);
            val = val.getAttribute("data-value");
            $.post(model.orgClassUrl, {
                id: val,
                a: "eoclassjson"
            }, function(data) {
                console.log("complete"), data && (data.list && classesSelectWrapper && classesSelectWrapper.update(data.list), model.isOoViewEnabled && (data.isOrgTypeNew ? classesDiv.classList.add("step1__org-class-row_hidden") : classesDiv.classList.remove("step1__org-class-row_hidden")))
            })
        }, formSelectWrapper && (formSelectWrapper.change = function(selected) {
            selected && hideError(formSelectHint)
        }), name.addEventListener("blur", function(e) {
            isCorrect(this.value, nameHint)
        }), fullName.addEventListener("blur", function(e) {
            isCorrect(this.value, fullNameHint)
        })
    }
});
define("SchoolActivationStep2Erp/SchoolActivationStep2Erp", function() {
    "use strict";
    return function(model) {
        var submitButton = document.getElementsByClassName("submit-button")[0],
            fetchErpId = document.getElementById("fetch-by-erp-id-button"),
            firstName = document.getElementById("FirstName"),
            middleName = document.getElementById("MiddleName"),
            lastName = document.getElementById("LastName"),
            day = document.getElementById("Day"),
            month = document.getElementById("Month"),
            year = document.getElementById("Year"),
            sex = document.getElementById("Sex"),
            isValidErpPerson = document.getElementById("IsValidErpPerson"),
            fullname = document.getElementById("fullname"),
            sexPlaceholder = document.getElementById("sex-placeholder"),
            birthdayPlaceholder = document.getElementById("birthday-placeholder"),
            erpId = document.getElementsByClassName("input_erp-id")[0],
            erpIdHint = document.getElementsByClassName("yellow-hint_erp-id")[0],
            erpPersonDataContainer = document.getElementById("container_erp-person-data");
        erpId.addEventListener("change", function(e) {
            [firstName, lastName, middleName, day, month, year, sex, isValidErpPerson].forEach(function(e) {
                e.value = ""
            }), erpPersonDataContainer.style.maxHeight = null, erpPersonDataContainer.classList.remove("erp-person-data_active"), erpPersonDataContainer.classList.add("erp-person-data")
        }), erpId.addEventListener("blur", function(e) {
            hideError(), erpId.value || showError("fillErpId")
        }), erpId.addEventListener("keyup", function(e) {
            this.value = this.value.replace(/[^\d]/, "")
        }), fetchErpId.addEventListener("click", function(e) {
            hideError(), $.ajax({
                type: "GET",
                dataType: "json",
                url: model.fetchErpPersonUrl + "/" + erpId.value,
                success: function(data) {
                    var birthday;
                    data.isMapped ? showError("personAlreadyMapped") : data.isValid ? (firstName.value = data.firstName, lastName.value = data.lastName, middleName.value = data.middleName, birthday = new Date(data.birthday), day.value = birthday.getDate(), month.value = birthday.getMonth(), year.value = birthday.getFullYear(), sex.value = data.sex, isValidErpPerson.value = data.isValid, fullname.innerText = [data.lastName, data.firstName, data.middleName].join(" "), birthdayPlaceholder.innerText = [birthday.getDate(), model.months[birthday.getMonth()], birthday.getFullYear()].join(" "), sexPlaceholder.innerText = 1 === data.sex ? model.male : model.female, erpPersonDataContainer.classList.contains("erp-person-data_active") || (erpPersonDataContainer.classList.add("erp-person-data_active"), erpPersonDataContainer.classList.remove("erp-person-data"))) : showError("invalidErpPerson")
                },
                error: function() {
                    showError("erpError")
                }
            })
        }), submitButton.addEventListener("click", function(e) {
            e.preventDefault(), erpId.value ? "true" === isValidErpPerson.value.toLowerCase() ? document.forms[0].submit() : isErrorShown() || showError("fillErpId") : showError("fillErpId")
        }, !1);
        var erpIdHintTextElement = erpIdHint.getElementsByClassName("yellow-hint__wrapper")[0];

        function showError(prop) {
            erpIdHintTextElement.innerText = model[prop], erpIdHint.classList.remove("yellow-hint_hidden")
        }

        function hideError() {
            isErrorShown() && erpIdHint.classList.add("yellow-hint_hidden")
        }

        function isErrorShown() {
            return !erpIdHint.classList.contains("yellow-hint_hidden")
        }
    }
});
define("SchoolActivationStep2/SchoolActivationStep2", function() {
    "use strict";
    return function(femailRadio) {
        var submitButton = document.getElementsByClassName("submit-button")[0],
            name = document.getElementsByClassName("input_name")[0],
            nameHint = document.getElementsByClassName("yellow-hint_name")[0],
            middleName = document.getElementsByClassName("input_middle-name")[0],
            middleNameHint = document.getElementsByClassName("yellow-hint_middle-name")[0],
            lastName = document.getElementsByClassName("input_last-name")[0],
            lastNameHint = document.getElementsByClassName("yellow-hint_last-name")[0],
            dayWrapper = document.getElementById(femailRadio.dayWrapperId),
            monthWrapper = document.getElementById(femailRadio.monthWrapperId),
            yearWrapper = document.getElementById(femailRadio.yearWrapperId),
            birthdateHint = document.getElementsByClassName("yellow-hint_birthdate")[0],
            sexHint = document.getElementsByClassName("yellow-hint_sex")[0],
            mailRadio = document.getElementById(femailRadio.mailRadioWrapperId).getElementsByTagName("input")[0],
            femailRadio = document.getElementById(femailRadio.femaleRadioWrapperId).getElementsByTagName("input")[0];

        function isCorrect(e, hint) {
            return e ? ((e = hint).classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden"), !0) : (hint.classList.remove("yellow-hint_hidden"), !1)
        }

        function getSelectedValue(s) {
            return s.getElementsByClassName("select-value")[0].value
        }
        submitButton.addEventListener("click", function(year) {
            year.preventDefault();
            var day, month, isValid = isCorrect(lastName.value, lastNameHint),
                isValid = isCorrect(name.value, nameHint) && isValid;
            isValid = isCorrect(middleName.value, middleNameHint) && isValid, isValid = isCorrect(0 < document.getElementsByClassName("radio-button_checked").length, sexHint) && isValid, (isValid = isCorrect((day = getSelectedValue(dayWrapper), month = getSelectedValue(monthWrapper), year = getSelectedValue(yearWrapper), !!(day && month && year)), birthdateHint) && isValid) && document.forms[0].submit()
        }, !1), name.addEventListener("blur", function(e) {
            isCorrect(this.value, nameHint)
        }), lastName.addEventListener("blur", function(e) {
            isCorrect(this.value, lastNameHint)
        }), middleName.addEventListener("blur", function(e) {
            isCorrect(this.value, middleNameHint)
        }), mailRadio.addEventListener("click", function(e) {
            isCorrect(this.checked, sexHint)
        }), femailRadio.addEventListener("click", function(e) {
            isCorrect(this.checked, sexHint)
        })
    }
});
define("SchoolJoinStep4Employee/SchoolJoinStep4Employee", function() {
    return function(model) {
        var updateView, send, captchaInput, captchaHint, doc = document,
            location = model.locationId,
            captchaWrapper = doc.getElementById(model.captchaWrapperId),
            checkboxWrapper = doc.getElementById(model.checkboxWrapperId),
            location = doc.getElementById(location),
            checkbox = checkboxWrapper.getElementsByClassName("checkbox-value")[0],
            checkboxHint = doc.getElementsByClassName("yellow-hint_agreement-hint")[0],
            shortName = doc.getElementsByClassName("input_short-name-validation")[0],
            fullName = doc.getElementsByClassName("input_full-name-validation")[0],
            fio = (doc.getElementsByClassName("select_org-type-validation")[0], doc.getElementsByClassName("input_fio-validation")[0]),
            senderEmail = doc.getElementsByClassName("input_sender-email-validation")[0],
            senderEmailRepeat = doc.getElementsByClassName("input_sender-email-repeat-validation")[0],
            shortNameHint = doc.getElementsByClassName("yellow-hint_short-name-hint")[0],
            fullNameHint = doc.getElementsByClassName("yellow-hint_full-name-hint")[0],
            fioHint = (doc.getElementsByClassName("yellow-hint_org-type-hint")[0], doc.getElementsByClassName("yellow-hint_fio-hint")[0]),
            senderMailHint = doc.getElementsByClassName("yellow-hint_sender-email-hint")[0],
            senderMailRepeatHint = doc.getElementsByClassName("yellow-hint_sender-email-repeat-hint")[0],
            locationHint = doc.getElementsByClassName("yellow-hint_placement-hint")[0];

        function showError(e, msg) {
            e.classList.remove("yellow-hint_hidden"), msg && (e.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = msg)
        }

        function hideError(e) {
            e.classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden")
        }

        function isCorrect(input, hint) {
            return input.value ? (hideError(hint), input.classList.remove("input_with-message"), !0) : (input.classList.add("input_with-message"), showError(hint), !1)
        }
        captchaWrapper && (captchaInput = captchaWrapper.querySelector(".input_captcha-validation"), captchaHint = doc.querySelector(".yellow-hint_captcha-hint"), captchaInput.addEventListener("input", function() {
            this.value && (captchaInput.classList.remove("input_with-message"), hideError(captchaHint))
        })), shortName.addEventListener("input", function() {
            return isCorrect(shortName, shortNameHint)
        }), fullName.addEventListener("input", function() {
            return isCorrect(fullName, fullNameHint)
        }), fio.addEventListener("input", function() {
            return isCorrect(fio, fioHint)
        }), checkboxWrapper.addEventListener("click", function() {
            ("false" === checkbox.value ? showError : hideError)(checkboxHint)
        }), send = function() {
            Q($.ajax({
                url: model.emailAndEmailRepeatValidationUrl,
                type: "POST",
                data: {
                    email: encodeURIComponent(senderEmail.value),
                    emailRepeat: encodeURIComponent(senderEmailRepeat.value)
                }
            })).then(updateView)
        }, updateView = function(data) {
            data.EmailError ? (showError(senderMailHint, data.EmailError), senderEmail.classList.add("input_with-message"), senderEmailRepeat.classList.remove("input_with-message"), senderEmailRepeat.classList.remove("input_correctly")) : (senderEmail.classList.remove("input_with-message"), hideError(senderMailHint)), data.EmailRepeatError ? (showError(senderMailRepeatHint, data.EmailRepeatError), senderEmailRepeat.classList.add("input_with-message"), senderEmailRepeat.classList.remove("input_correctly")) : (senderEmailRepeat.classList.remove("input_with-message"), hideError(senderMailRepeatHint)), data.IsValid && (senderEmail.classList.remove("input_with-message"), senderEmailRepeat.classList.remove("input_with-message"), senderEmailRepeat.classList.add("input_correctly"))
        }, location.change = function(e) {
            hideError(locationHint)
        }, senderEmail.addEventListener("input", function() {
            send()
        }, !1), senderEmailRepeat.addEventListener("input", function() {
            send()
        }, !1)
    }
});
define("SchoolJoinStep2/SchoolJoinStep2", function() {
    return function(doc) {
        var location = doc.locationId,
            searchId = doc.searchId,
            doc = document,
            schoolTable = doc.getElementsByClassName("school-join-2__school-table")[0],
            schoolSearchInput = schoolTable.getElementsByClassName("search-school__input")[0],
            location = doc.getElementById(location),
            search = doc.getElementById(searchId);
        location.change = function(id) {
            var url;
            schoolSearchInput.value = "", schoolSearchInput.setAttribute("value", ""), id ? (url = id.target.getAttribute("href"), id = id.target.getAttribute("data-id"), schoolTable.classList.remove("school-join-2__school-table_hidden"), search.changeUrl(url), search.load(url, id, "")) : schoolTable.classList.add("school-join-2__school-table_hidden")
        }, search.updated = function(len) {
            len && schoolTable.classList.remove("school-join-2__school-table_hidden")
        }
    }
});
define("SchoolJoinStep1/SchoolJoinStep1", function() {
    return function(selectWrapper) {
        var doc = document,
            selectWrapper = doc.getElementById(selectWrapper.selectWrapperId),
            button = doc.getElementsByClassName("school-join-step1__button")[0];
        selectWrapper.change = function() {
            button.classList.remove("school-join-step1__button_hidden")
        }
    }
});
define("SearchSchool/SearchSchool", function() {
    return function(selectedCityId) {
        function createFragment(data) {
            var fragment = doc.createDocumentFragment();
            return _.forEach(data.Items, function(item) {
                fragment.appendChild(function(item) {
                    var element = doc.createElement("li"),
                        link = doc.createElement("a"),
                        image = doc.createElement("img"),
                        pointer = doc.createElement("div"),
                        span = doc.createElement("span");
                    return element.classList.add("search-school__list__item"), link.classList.add("search-school__list__link"), image.classList.add("search-school__list__link__school-photo"), pointer.classList.add("search-school__list__link__pointer"), span.classList.add("search-school__list__link__schoolname"), image.setAttribute("src", item.ImageUrl), link.setAttribute("href", item.Url), span.textContent = item.Title, link.appendChild(image), link.appendChild(pointer), link.appendChild(span), element.appendChild(link), element
                }(item))
            }), fragment
        }

        function showMoreRender(data) {
            data.ShowMoreUrl ? (showMore.setAttribute("href", data.ShowMoreUrl), showMore.classList.remove("show-more_hidden")) : showMore.classList.add("show-more_hidden")
        }

        function insert(data) {
            var fragment;
            return text.textContent = data.Count, showMoreRender(data), list.innerHTML = "", 0 != data.Items.length && (fragment = createFragment(data), list.appendChild(fragment)), data
        }

        function append(fragment) {
            showMoreRender(fragment), fragment = createFragment(fragment), list.appendChild(fragment)
        }

        function update(data) {
            search.updated && search.updated(data.Items.length)
        }

        function showNotFound(inner) {
            function hide() {
                notFound.classList.remove("search-school-not-found_active"), search.classList.remove("search-school_hidden")
            }
            return function(data) {
                !inner && 0 === data.Items.length ? (notFound.classList.add("search-school-not-found_active"), search.classList.add("search-school_hidden")) : hide()
            }
        }

        function load(url, city, value, inner) {
            city = city || "", text.textContent = "", Q($.get(url, {
                    schoolQuery: encodeURIComponent(value)
                })).then(insert).then(showNotFound(inner)).then(update),
                function(url) {
                    url = defaultHelpUrl + "/" + url;
                    helpWithQuestionmak.setAttribute("href", url)
                }(city)
        }
        var id = selectedCityId.id,
            showMoreId = selectedCityId.showMoreId,
            input = selectedCityId.helpWithQuestionmakId,
            searchUrl = selectedCityId.url,
            selectedCityId = selectedCityId.selectedCityId,
            doc = document,
            notFound = doc.getElementsByClassName("search-school-not-found")[0],
            search = doc.getElementById(id),
            showMore = doc.getElementById(showMoreId),
            helpWithQuestionmak = doc.getElementById(input),
            defaultHelpUrl = helpWithQuestionmak.getAttribute("href"),
            input = search.getElementsByClassName("search-school__input")[0],
            text = search.getElementsByClassName("search-school__text")[0].children[0],
            list = search.getElementsByClassName("search-school__list")[0];
        input.addEventListener("input", function(e) {
            load(searchUrl, null, this.value, !0)
        }), showMore.addEventListener("click", function(link) {
            link.preventDefault();
            link = link.target.href;
            Q($.get(link)).then(append)
        }), search.changeUrl = function(url) {
            searchUrl = url
        }, (search.load = load)(searchUrl, selectedCityId, input.value)
    }
});
define("SecurityStep/SecurityStep", ["../../modules/utils/ajax-request-manager", "utils/toggleTimer", "Input/Input_phone", "analytics/emailNoticeMetrika"], function(AjaxManager, toggleTimer, phoneInputScript, metrika) {
    "use strict";
    var ajxManager = new AjaxManager;
    return function(model) {
        var phoneLabel, emailLabel, phoneContent, emailContent, codeInputs, codeHints, sendEmailCodeBtn, sendPhoneCodeBtn, emailCodeTimerContainer, clearPhoneInput = document.querySelector(".submit-button"),
            answerValidationUrl = model.answerValidationUrl,
            ownQuestionValidationUrl = model.ownQuestionValidationUrl,
            questionSelect = document.getElementById(model.questionSelectId),
            questionHint = document.querySelector(".yellow-hint_question-hint"),
            emailInput = document.querySelector(".input_email-validation"),
            emailHint = document.querySelector(".yellow-hint_email-hint"),
            phoneInput = document.querySelector(".input_phone-validation"),
            phoneHint = document.querySelector(".yellow-hint_phone-hint"),
            answerInput = document.querySelector(".input_answer-validation"),
            answerHint = document.querySelector(".yellow-hint_answer-hint"),
            phoneCodeTimerContainer = document.querySelector(".input_own-question-validation"),
            ownQuestionHint = document.querySelector(".yellow-hint_own-question-hint"),
            ownQuestionId = model.ownQuestionId,
            isEmailValid = model.isEmailValid,
            isPhoneValid = model.isPhoneValid,
            isAnswerValid = model.isAnswerValid,
            isOwnQuestionValid = model.isOwnQuestionValid,
            needValidateOwnQuestion = model.needValidateOwnQuestion,
            needValidateEmailOrPhone = model.needValidateEmailOrPhone,
            needValidatePhone = model.needValidatePhone,
            isPhoneEnabled = model.isPhoneEnabled,
            hasSecurityQuestion = model.hasSecurityQuestion,
            resources = model.resources,
            cyrillicValidatorPattern = new RegExp(model.validation.cyrillicValidatorPattern),
            emailLengthValidatorMinLength = model.validation.emailLengthValidatorMinLength,
            emailLengthValidatorMaxLength = model.validation.emailLengthValidatorMaxLength,
            emailRegexPattern = new RegExp(model.validation.emailRegexPattern),
            nocountrycodephonePattern = new RegExp(model.validation.nocountrycodephonePattern),
            token = document.getElementById("Token").value,
            agreeSubscriptionCheckBox = model.agreeSubscriptionCheckBoxId && document.querySelector("#" + model.agreeSubscriptionCheckBoxId + " > input[type=checkbox]"),
            smsHintMessage = model.smsHintMessage;

        function removePhoneBrackets(value) {
            return value.replace(model.countryCode, "").replace(/\s/g, "").replace("(", "").replace(")", "")
        }

        function validatePhone(noBracketesValue) {
            noBracketesValue = removePhoneBrackets(noBracketesValue);
            return noBracketesValue ? nocountrycodephonePattern.test(noBracketesValue) ? void 0 : resources.loginSchoolactivationPhoneFormat : resources.loginSchoolactivationEmptyPhone
        }

        function isCorrect(value, hint) {
            return value ? (hideError(hint), !0) : (showError(hint), !1)
        }

        function post(url, value, request) {
            request = $.post(url, {
                value: value
            }, request, "json");
            ajxManager.addRequest(request)
        }

        function showError(e, msg) {
            e.classList.remove("yellow-hint_hidden"), msg && (e.getElementsByClassName("yellow-hint__wrapper")[0].innerHTML = msg)
        }

        function hideError(e) {
            e && !e.classList.contains("yellow-hint_hidden") && e.classList.add("yellow-hint_hidden")
        }

        function toggleContactSelectedType(hideElement, showElement) {
            hideElement.classList.add("security-step_contact-type-container_hidden"), showElement.classList.remove("security-step_contact-type-container_hidden")
        }

        function setTrigger(element, hideElement, showElement, clear) {
            element.classList.contains("radio-button_checked") && toggleContactSelectedType(hideElement, showElement), element.addEventListener("click", function() {
                toggleContactSelectedType(hideElement, showElement), clear()
            })
        }

        function sendCodeRequest(hint, type, value, runTimer) {
            hideError(hint), $.ajax({
                type: "POST",
                dataType: "json",
                url: model.sendCodeUrl,
                data: {
                    token: token,
                    type: type,
                    value: value
                },
                success: function(data) {
                    if (!data.success) return data.error ? void showError(hint, data.error) : void showError(hint, resources.unexpectedError);
                    0 <= data.messageId && function(hint, messageId) {
                        setTimeout(function() {
                            $.ajax({
                                type: "GET",
                                datatype: "json",
                                url: model.baseUrl + "/api/smsvalidation/" + messageId + "/status",
                                success: function(data) {
                                    data.error && showError(hint, data.error)
                                }
                            })
                        }, model.timerDuration / 2 * 1e3)
                    }(hint, data.messageId), runTimer()
                },
                error: function() {
                    showError(hint, resources.unexpectedError)
                }
            })
        }
        hasSecurityQuestion && (questionSelect.change = function(secretDiv) {
            secretDiv && hideError(questionHint);
            var val = parseInt(secretDiv.getAttribute("data-value")),
                secretDiv = document.getElementsByClassName("own-question")[0];
            val === ownQuestionId ? (needValidateOwnQuestion = !0, secretDiv.classList.contains("own-question_hidden") && secretDiv.classList.remove("own-question_hidden")) : (needValidateOwnQuestion = !1, secretDiv.classList.add("own-question_hidden"))
        }, answerInput.addEventListener("blur", function(e) {
            post(answerValidationUrl, encodeURIComponent(this.value), function(data) {
                data.IsValid ? (isAnswerValid = !0, hideError(answerHint)) : (isAnswerValid = !1, showError(answerHint, data.Error))
            })
        }), phoneCodeTimerContainer.addEventListener("blur", function(e) {
            post(ownQuestionValidationUrl, encodeURIComponent(this.value), function(data) {
                data.IsValid ? (isOwnQuestionValid = !0, hideError(ownQuestionHint)) : (isOwnQuestionValid = !1, showError(ownQuestionHint, data.Error))
            })
        })), needValidatePhone && emailInput.addEventListener("blur", function(e) {
            isCorrect(emailInput.value && isEmailValid, emailHint)
        }), emailInput.addEventListener("input", function(e) {
            var errorMessage;
            return this.value ? cyrillicValidatorPattern.exec(this.value) ? errorMessage = resources.rootEmailValidationCyrillicEmail : this.value.length < emailLengthValidatorMinLength || this.value.Length > emailLengthValidatorMaxLength ? errorMessage = resources.loginSchoolactivationLengthEmail : emailRegexPattern.exec(this.value) || (errorMessage = resources.rootEmailValidationWrongEmail) : errorMessage = resources.rootEmailValidationNoEmail, errorMessage ? (isEmailValid = !1, showError(emailHint, errorMessage), !1) : (isEmailValid = !0, void hideError(emailHint))
        }), phoneInput && (needValidatePhone && phoneInput.addEventListener("blur", function(e) {
            var errorMessage = validatePhone(this.value);
            errorMessage ? (isPhoneValid = !1, showError(phoneHint, errorMessage)) : (isPhoneValid = !0, hideError(phoneHint))
        }), phoneInput.addEventListener("input", function(e) {
            var errorMessage;
            removePhoneBrackets(phoneInput.value) ? (errorMessage = validatePhone(this.value)) ? (isPhoneValid = !1, showError(phoneHint, errorMessage)) : (isPhoneValid = !0, hideError(phoneHint)) : hideError(phoneHint)
        })), clearPhoneInput.addEventListener("click", function(phoneValue) {
            phoneValue.preventDefault();
            var isValuesValid = isCorrect(!hasSecurityQuestion || -1 !== questionSelect.getElementsByTagName("select")[0].selectedIndex, questionHint);
            needValidateEmailOrPhone ? isValuesValid = function() {
                {
                    return emailInput.value && isEmailValid ? (hideError(emailHint), hideError(phoneHint), !0) : phoneInput ? removePhoneBrackets(phoneInput.value) && isPhoneValid ? (hideError(phoneHint), hideError(emailHint), !0) : (showError(emailHint), showError(phoneHint), !1) : (showError(emailHint), hideError(phoneHint), !1)
                }
            }() && isValuesValid : (isValuesValid = isCorrect(emailInput.value, emailHint) && isCorrect(isEmailValid, emailHint) && isValuesValid, isPhoneEnabled && (phoneValue = removePhoneBrackets(phoneInput.value), needValidatePhone && (isValuesValid = isCorrect(phoneValue, phoneHint) && isCorrect(isPhoneValid, phoneHint) && isValuesValid), phoneValue && (isValuesValid = isCorrect(isPhoneValid, phoneHint) && isValuesValid))), hasSecurityQuestion && (isValuesValid = isCorrect(answerInput.value, answerHint) && isCorrect(isAnswerValid, answerHint) && isValuesValid, needValidateOwnQuestion && (isValuesValid = isCorrect(!!document.getElementsByClassName("input_own-question-validation")[0].value, ownQuestionHint) && isCorrect(isOwnQuestionValid, ownQuestionHint) && isValuesValid)), isValuesValid && (agreeSubscriptionCheckBox && metrika.send(agreeSubscriptionCheckBox.checked ? "agree_registration" : "disagree_registration", model.personId), document.forms[0].submit())
        }, !1), model.userActivationAndRecoveryWithMobileEnabled && (phoneLabel = document.getElementById(model.phoneLabelId), emailLabel = document.getElementById(model.emailLabelId), phoneContent = document.getElementById("phone-content"), emailContent = document.getElementById("email-content"), codeInputs = document.querySelectorAll(".input_code"), codeHints = document.querySelectorAll(".yellow-hint_code"), sendEmailCodeBtn = document.getElementById("send-email-code"), sendPhoneCodeBtn = document.getElementById("send-phone-code"), emailCodeTimerContainer = document.getElementById("email-timer"), phoneCodeTimerContainer = document.getElementById("phone-timer"), clearPhoneInput = phoneInputScript({
            id: phoneInput.id,
            template: model.defaultPhoneTemplate,
            phoneLength: model.phoneLength
        }).clear, codeInputs.forEach(function(input) {
            input.addEventListener("input", function() {
                codeHints.forEach(hideError)
            })
        }), toggleTimer({
            timerContainer: emailCodeTimerContainer,
            hideElement: sendEmailCodeBtn,
            hideClassName: "security-step_item-hidden",
            timerDuration: model.timerDuration,
            timerTextTemplate: model.timerTextTemplate,
            noHiding: !0,
            onClick: function(e, runTimer) {
                e.preventDefault(), isEmailValid && sendCodeRequest(emailHint, 1, emailInput.value, runTimer)
            }
        }), toggleTimer({
            timerContainer: phoneCodeTimerContainer,
            hideElement: sendPhoneCodeBtn,
            hideClassName: "security-step_item-hidden",
            timerDuration: model.timerDuration,
            timerTextTemplate: model.timerTextTemplate,
            noHiding: !0,
            onClick: function(e, runTimer) {
                e.preventDefault(), isPhoneValid && sendCodeRequest(phoneHint, 2, phoneInput.value, runTimer)
            },
            callback: function() {
                showError(phoneHint, smsHintMessage)
            }
        }), setTrigger(phoneLabel, emailContent, phoneContent, function() {
            emailInput.value = ""
        }), setTrigger(emailLabel, phoneContent, emailContent, clearPhoneInput))
    }
});
define("UserActivationStep1/UserActivationStep1", function() {
    "use strict";
    return function(model) {
        var submitButton = document.getElementsByClassName("submit-button")[0],
            dayWrapper = document.getElementById(model.dayWrapperId),
            monthWrapper = document.getElementById(model.monthWrapperId),
            yearWrapper = document.getElementById(model.yearWrapperId),
            femailRadio = document.getElementsByClassName("user-registration-hint-birthday")[0],
            birthdateHint = null == femailRadio ? null : femailRadio.getElementsByClassName("yellow-hint")[0],
            sexHint = document.getElementsByClassName("yellow-hint_sex")[0],
            mailRadioWrapper = document.getElementById(model.mailRadioWrapperId),
            mailRadio = null == mailRadioWrapper ? null : mailRadioWrapper.getElementsByTagName("input")[0],
            femailRadio = document.getElementById(model.femaleRadioWrapperId),
            femailRadio = null == femailRadio ? null : femailRadio.getElementsByTagName("input")[0],
            needValidateSex = model.validateSex;

        function isCorrect(e, hint) {
            return e ? (hint && ((e = hint).classList.contains("yellow-hint_hidden") || e.classList.add("yellow-hint_hidden")), !0) : (hint && hint.classList.remove("yellow-hint_hidden"), !1)
        }

        function getSelectedValue(s) {
            return s.getElementsByClassName("select-value")[0].value
        }
        submitButton.addEventListener("click", function(isValid) {
            isValid.preventDefault();
            isValid = isCorrect(function() {
                if (dayWrapper) {
                    var day = getSelectedValue(dayWrapper),
                        month = getSelectedValue(monthWrapper),
                        year = getSelectedValue(yearWrapper);
                    return day && month && year ? !0 : !1
                }
                return !0
            }(), birthdateHint);
            needValidateSex && (isValid = isCorrect(!mailRadioWrapper || 0 < document.getElementsByClassName("radio-button_checked").length, sexHint) && isValid), isValid && document.forms[0].submit()
        }, !1), mailRadio && femailRadio && (mailRadio.addEventListener("click", function(e) {
            isCorrect(this.checked, sexHint)
        }), femailRadio.addEventListener("click", function(e) {
            isCorrect(this.checked, sexHint)
        }))
    }
});
define("MealsTastingEventInfo/MealsTastingEventInfo", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        function hidePreloader() {
            confirmButton.classList.remove("button_hide-i"), preloader.classList.remove("preloader_active")
        }
        var dialogs = dnevnik.dialogs,
            root = document.getElementById(model.popupId),
            confirmButton = root.querySelector(".event-info-popup__parts__buttons__confirm"),
            preloader = root.querySelector(".preloader"),
            checkboxes = root.querySelectorAll(".blue-checkbox__input");
        confirmButton && confirmButton.addEventListener("click", function() {
            var selectedPersons = function() {
                for (var personIds = [], i = 0; i < checkboxes.length; i += 1) {
                    var checkbox = checkboxes[i];
                    checkbox.checked && personIds.push(checkbox.getAttribute("data-person-id"))
                }
                return personIds
            }();
            if (selectedPersons && 0 === selectedPersons.length) return dialogs.error(model.selectPersonsError), !1;
            confirmButton.classList.add("button_hide-i"), preloader.classList.add("preloader_active"), $.ajax({
                type: "POST",
                url: model.submitUrl,
                dataType: "json",
                traditional: !0,
                data: {
                    eventId: model.eventId,
                    selectedPersons: selectedPersons
                },
                success: function(data) {
                    data.success ? (dialogs.message(data.message), window.location.replace(data.redirectUrl)) : (dialogs.error(data.error), hidePreloader())
                },
                error: function() {
                    dialogs.error(model.errorMessage), hidePreloader()
                }
            })
        })
    }
});
define("MealsTastingNewEvent/MealsTastingNewEvent", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        function hidePreloader() {
            confirmButton.classList.remove("button_hide-i"), preloader.classList.remove("preloader_active")
        }
        var dialogs = dnevnik.dialogs,
            root = document.getElementById(model.popupId),
            confirmButton = root.querySelector(".new-event-popup__buttons__confirm"),
            form = root.querySelector("form"),
            preloader = root.querySelector(".preloader");
        confirmButton.addEventListener("click", function() {
            confirmButton.classList.add("button_hide-i"), preloader.classList.add("preloader_active"), $.ajax({
                type: "POST",
                url: model.submitUrl,
                dataType: "json",
                data: new FormData(form),
                processData: !1,
                contentType: !1,
                success: function(data) {
                    data.success ? (dialogs.message(data.message), window.location.replace(data.redirectUrl)) : (dialogs.error(data.error.replace("\r\n", "<br/>")), hidePreloader())
                },
                error: function() {
                    dialogs.error(model.errorMessage), hidePreloader()
                }
            })
        })
    }
});
define("MealsTastingEventDeleteConfirm/MealsTastingEventDeleteConfirm", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        function hidePreloader() {
            confirmButton.classList.remove("button_hide-i"), preloader.classList.remove("preloader_active")
        }
        var dialogs = dnevnik.dialogs,
            root = document.getElementById(model.popupId),
            confirmButton = root.querySelector(".meals-tasting-event-delete-confirm__buttons__confirm"),
            preloader = root.querySelector(".preloader");
        confirmButton.addEventListener("click", function() {
            confirmButton.classList.add("button_hide-i"), preloader.classList.add("preloader_active"), $.ajax({
                type: "POST",
                url: model.submitUrl,
                dataType: "json",
                traditional: !0,
                data: {
                    eventId: model.eventId
                },
                success: function(data) {
                    data.success ? (dialogs.message(data.message), window.location.replace(data.redirectUrl)) : (dialogs.error(data.error), hidePreloader())
                },
                error: function() {
                    dialogs.error(model.errorMessage), hidePreloader()
                }
            })
        })
    }
});
define("HomeBasedEducationJournalList/HomeBasedEducationJournalList", [], function() {
    "use strict";
    return function(journals) {
        journals = document.getElementById(journals.id).querySelectorAll(".homebasededucation-journal-list__journal");
        _.each(journals, function(journal) {
            var icon = journal.querySelector(".homebasededucation-journal-list__journal__icon"),
                items = journal.querySelector(".homebasededucation-journal-list__journal__subjects");
            icon.addEventListener("click", function() {
                journal.classList.add("homebasededucation-journal-list__journal_active")
            }), document.body.addEventListener("mousedown", function(e) {
                journal.classList.contains("homebasededucation-journal-list__journal_active") && e.target !== icon && ! function(child, parent) {
                    for (; child && child !== parent;) child = child.parentNode;
                    return child
                }(e.target, items) && journal.classList.remove("homebasededucation-journal-list__journal_active")
            })
        })
    }
});
define("HomeBasedEducationSelectTransferType/HomeBasedEducationSelectTransferType", function() {
    return function() {
        var content = document.querySelector(".homebasededucation-transfer-type__content"),
            inpType = content.querySelectorAll("[name = 'transferType']"),
            finishDate = content.querySelector("[name = 'finishDate']"),
            help = content.querySelector(".homebasededucation-transfer-type__help-default"),
            helpAct = content.querySelector(".homebasededucation-transfer-type__help-actual"),
            helpErr = content.querySelector(".homebasededucation-transfer-type__help-error");
        if (inpType)
            for (var i = 0; i < inpType.length; i++) inpType[i].addEventListener("change", fieldsDisplay);

        function fieldsDisplay(event) {
            "actual" === event.target.value ? (finishDate.classList.remove("homebasededucation-transfer-type__no-display"), help.classList.add("homebasededucation-transfer-type__no-display"), helpAct.classList.remove("homebasededucation-transfer-type__no-display"), helpErr.classList.add("homebasededucation-transfer-type__no-display")) : (finishDate.classList.add("homebasededucation-transfer-type__no-display"), help.classList.add("homebasededucation-transfer-type__no-display"), helpAct.classList.add("homebasededucation-transfer-type__no-display"), helpErr.classList.remove("homebasededucation-transfer-type__no-display"))
        }
    }
});
define("BlueBorderedPopup/BlueBorderedPopup", function() {
    "use strict";
    return function(exit) {
        var choosePeriodPopup = document.getElementById(exit.id),
            overlay = choosePeriodPopup.querySelector("div.blue-bordered-popup__overlay"),
            exit = choosePeriodPopup.querySelector("button.blue-bordered-popup__exit-button");
        this.showPopup = function() {
            choosePeriodPopup.style.display = "block"
        };
        var hide = this.hidePopUp = function() {
            choosePeriodPopup.style.display = "none"
        };
        exit && exit.addEventListener("click", hide), overlay.addEventListener("click", hide), document.addEventListener("keydown", function(e) {
            27 === e.keyCode && hide()
        })
    }
});
define("ChoosePeriod/ChoosePeriod", ["BlueBorderedPopup/BlueBorderedPopup"], function(popup) {
    "use strict";
    return function(model) {
        var container = document.getElementById(model.periodBlockId),
            submitButton = document.getElementById(model.submitId),
            cancelButton = document.getElementById(model.cancelId),
            showDlgButton = document.getElementById(model.choosePeriodLink);
        container.addEventListener("intervalvalidated", function(e) {
            e.detail.isValid ? submitButton.removeAttribute("disabled") : submitButton.setAttribute("disabled", "disabled")
        });
        var popupDlg = new popup({
            id: model.popupId
        });
        cancelButton.addEventListener("click", function(event) {
            event.preventDefault(), event.stopPropagation(), popupDlg.hidePopUp();
            var dateInputFrom = $(container).find("#" + model.dateFromId),
                event = $(container).find("#" + model.dateToId);
            dateInputFrom.calendar.setDate(container.getAttribute("oldDateFrom"), dateInputFrom), event.calendar.setDate(container.getAttribute("oldDateTo"), event);
            event = document.createEvent("CustomEvent");
            return event.initCustomEvent("validateValues", !0, !0, {}), container.dispatchEvent(event), !1
        }), showDlgButton.addEventListener("click", function(e) {
            return e.preventDefault(), e.stopPropagation(), popupDlg.showPopup(), !1
        })
    }
});
define("DeleteLesson/DeleteLesson", ["async/polling", "dialogs/dialogs"], function(polling, dialogs) {
    "use strict";
    return function(model) {
        var root = document.getElementById(model.id),
            teacherToDeleteSelect = document.getElementById(model.teacherToDeleteSelectId),
            subjectSelect = document.getElementById(model.subjectSelectId),
            groupSelect = document.getElementById(model.groupSelectId),
            subgroupSelect = document.getElementById(model.subgroupSelectId),
            reasonSelect = document.getElementById(model.reasonSelectId),
            cancelButton = root.querySelector(".delete-lesson__cancel-button"),
            deleteButton = root.querySelector(".delete-lesson__delete-button"),
            periodFromToInput = root.querySelector("input[name=period][value=fromTo]"),
            periodDateStartInput = root.querySelector("input[name=dateStart]"),
            periodDateFinishInput = root.querySelector("input[name=dateFinish]"),
            periodToTheEndOfYearInput = root.querySelector("input[name=period][value=toTheEndOfYear]"),
            filtersPanel = root.querySelector(".delete-lesson__filters-panel"),
            cancelConfirmPanel = root.querySelector(".delete-lesson__cancel-confirm-panel"),
            cancelConfirmPanelContent = cancelConfirmPanel.querySelector(".delete-lesson__cancel-confirm-panel-content"),
            cancelConfirmPanelInfo = cancelConfirmPanel.querySelector(".delete-lesson__cancel-confirm-panel-info"),
            cancelPanelLoader = cancelConfirmPanel.querySelector(".delete-lesson__cancel-loader-container"),
            cancelConfirmButton = cancelConfirmPanel.querySelector(".delete-lesson__cancel-confirm-button"),
            cancelCancelButton = cancelConfirmPanel.querySelector(".delete-lesson__cancel-cancel-button"),
            deleteConfirmPanel = root.querySelector(".delete-lesson__delete-confirm-panel"),
            deleteConfirmPanelContent = deleteConfirmPanel.querySelector(".delete-lesson__delete-confirm-panel-content"),
            deleteConfirmPanelInfo = deleteConfirmPanel.querySelector(".delete-lesson__delete-confirm-panel-info"),
            deletePanelLoader = deleteConfirmPanel.querySelector(".delete-lesson__delete-loader-container"),
            deleteConfirmButton = deleteConfirmPanel.querySelector(".delete-lesson__delete-confirm-button"),
            deleteCancelButton = deleteConfirmPanel.querySelector(".delete-lesson__delete-cancel-button"),
            runTaskPanel = root.querySelector(".delete-lesson__run-task-panel"),
            errorPanel = root.querySelector(".delete-lesson__error-panel"),
            errorPanelRetryButton = root.querySelector(".delete-lesson__retry-button"),
            passwordInput = root.querySelector("input[name=password]");

        function switchToPanel(panel) {
            filtersPanel.classList.toggle("delete-lesson__panel_inactive", panel !== filtersPanel), cancelConfirmPanel.classList.toggle("delete-lesson__panel_inactive", panel !== cancelConfirmPanel), deleteConfirmPanel.classList.toggle("delete-lesson__panel_inactive", panel !== deleteConfirmPanel), runTaskPanel.classList.toggle("delete-lesson__panel_inactive", panel !== runTaskPanel), errorPanel.classList.toggle("delete-lesson__panel_inactive", panel !== errorPanel)
        }

        function switchToFiltersPanel() {
            switchToPanel(filtersPanel)
        }

        function updateSelect(select, data, noDataMessage) {
            0 < data.length ? (select.update(data, 0, "id", "name"), select.enable()) : (select.update([], 0, null, null, noDataMessage), select.disable())
        }

        function reloadGroupSelect() {
            groupSelect.disable(), subgroupSelect.disable();
            var teacherId = teacherToDeleteSelect.getSelectValue(),
                subjectId = subjectSelect.getSelectValue();
            !subjectId || subjectId <= 0 ? updateSelect(groupSelect, [], "") : $.ajax({
                type: "GET",
                url: model.listGroupsUrlTemplate.replace("{teacherId}", teacherId).replace("{subjectId}", subjectId),
                success: function(data) {
                    updateSelect(groupSelect, data, ""), reloadSubgroupSelect()
                },
                error: function() {
                    dnevnik.dialogs.error(model.errorMessage)
                }
            })
        }

        function reloadSubgroupSelect() {
            subgroupSelect.disable();
            var groupId = groupSelect.getSelectValue();
            !groupId || groupId <= 0 ? updateSelect(subgroupSelect, [], model.wholeGroupMessage) : $.ajax({
                type: "GET",
                url: model.listSubgroupsUrlTemplate.replace("{groupId}", groupId),
                success: function(data) {
                    updateSelect(subgroupSelect, data, model.wholeGroupMessage)
                },
                error: function() {
                    dnevnik.dialogs.error(model.errorMessage)
                }
            })
        }

        function syncButtons() {
            setTimeout(function() {
                var teacherToDeleteSelected = 0 < teacherToDeleteSelect.getSelectValue(),
                    subjectSelected = 0 < subjectSelect.getSelectValue(),
                    groupSelected = 0 <= groupSelect.getSelectValue(),
                    subgroupSelected = 0 <= subgroupSelect.getSelectValue(),
                    canDeleteOrCancel = periodFromToInput.checked && 0 < periodDateStartInput.value.length && 0 < periodDateFinishInput.value.length,
                    canDeleteOrCancel = periodToTheEndOfYearInput.checked || canDeleteOrCancel,
                    canDeleteOrCancel = teacherToDeleteSelected && subjectSelected && groupSelected && subgroupSelected && canDeleteOrCancel;
                cancelButton.disabled = !canDeleteOrCancel, deleteButton.disabled = !canDeleteOrCancel, deleteConfirmButton.disabled = !passwordInput.value
            }, 200)
        }

        function getCountConfirmationParameters(countCancelled) {
            return {
                teacherId: teacherToDeleteSelect.getSelectValue(),
                subjectId: subjectSelect.getSelectValue(),
                groupId: groupSelect.getSelectValue(),
                subgroupId: subgroupSelect.getSelectValue(),
                toTheEndOfStudyYear: periodToTheEndOfYearInput.checked,
                startDate: periodFromToInput.checked ? periodDateStartInput.value : null,
                finishDate: periodFromToInput.checked ? periodDateFinishInput.value : null,
                countCancelled: countCancelled
            }
        }

        function runCancelTask() {
            switchToPanel(runTaskPanel), $.ajax({
                type: "POST",
                url: model.startCancelLessonsTaskUrlTemplate,
                data: {
                    teacherId: teacherToDeleteSelect.getSelectValue(),
                    subjectId: subjectSelect.getSelectValue(),
                    groupId: groupSelect.getSelectValue(),
                    subgroupId: subgroupSelect.getSelectValue(),
                    toTheEndOfStudyYear: periodToTheEndOfYearInput.checked,
                    startDate: periodFromToInput.checked ? periodDateStartInput.value : null,
                    finishDate: periodFromToInput.checked ? periodDateFinishInput.value : null,
                    cancelReason: reasonSelect.getSelectValue() || ""
                },
                dataType: "json",
                success: function(data) {
                    polling.start({
                        taskID: data.taskId,
                        taskStateHandlerUrl: model.taskStateHandlerUrl,
                        success: function() {
                            processSuccessfulTaskResult(model.successCancelMessage)
                        },
                        error: processTaskError
                    })
                },
                error: function() {
                    processTaskError()
                }
            })
        }

        function runDeleteTask() {
            var isError;
            isError = !1, $.ajax({
                type: "POST",
                url: model.checkAdminPasswordUrl,
                data: {
                    password: passwordInput.value
                },
                dataType: "json",
                async: !1,
                success: function(data) {
                    data.success || (dnevnik.dialogs.error(data.error), isError = !0)
                },
                error: function(data) {
                    dnevnik.dialogs.error(data.error), isError = !0
                }
            }), isError || (switchToPanel(runTaskPanel), $.ajax({
                type: "POST",
                url: model.startDeleteLessonsTaskUrlTemplate,
                data: {
                    teacherId: teacherToDeleteSelect.getSelectValue(),
                    subjectId: subjectSelect.getSelectValue(),
                    groupId: groupSelect.getSelectValue(),
                    subgroupId: subgroupSelect.getSelectValue(),
                    toTheEndOfStudyYear: periodToTheEndOfYearInput.checked,
                    startDate: periodFromToInput.checked ? periodDateStartInput.value : null,
                    finishDate: periodFromToInput.checked ? periodDateFinishInput.value : null,
                    password: passwordInput.value
                },
                dataType: "json",
                success: function(data) {
                    polling.start({
                        taskID: data.taskId,
                        taskStateHandlerUrl: model.taskStateHandlerUrl,
                        success: function() {
                            processSuccessfulTaskResult(model.successDeleteMessage)
                        },
                        error: processTaskError
                    })
                },
                error: function() {
                    processTaskError()
                }
            }))
        }

        function processSuccessfulTaskResult(message) {
            var parentWindow = window.parent;
            parentWindow && (parentWindow.postMessage("show-message:" + message, "*"), parentWindow.postMessage("close-containing-modal", "*"))
        }

        function processTaskError() {
            switchToPanel(errorPanel)
        }
        teacherToDeleteSelect.change = function() {
            ! function() {
                subjectSelect.disable(), groupSelect.disable(), subgroupSelect.disable();
                var teacherId = teacherToDeleteSelect.getSelectValue();
                $.ajax({
                    type: "GET",
                    url: model.listSubjectsUrlTemplate.replace("{teacherId}", teacherId),
                    success: function(data) {
                        updateSelect(subjectSelect, data, model.noSubjectsMessage), reloadGroupSelect()
                    },
                    error: function() {
                        dnevnik.dialogs.error(model.errorMessage)
                    }
                })
            }(), syncButtons()
        }, subjectSelect.change = function() {
            reloadGroupSelect(), syncButtons()
        }, groupSelect.change = function() {
            reloadSubgroupSelect(), syncButtons()
        }, periodDateStartInput.addEventListener("focus", function() {
            periodFromToInput.checked = !0, syncButtons()
        }), periodDateFinishInput.addEventListener("focus", function() {
            periodFromToInput.checked = !0, syncButtons()
        }), periodToTheEndOfYearInput.addEventListener("change", syncButtons), periodFromToInput.addEventListener("change", syncButtons), periodDateStartInput.addEventListener("change", syncButtons), periodDateStartInput.addEventListener("blur", syncButtons), periodDateFinishInput.addEventListener("change", syncButtons), periodDateFinishInput.addEventListener("blur", syncButtons), cancelButton.addEventListener("click", function() {
            cancelConfirmPanelContent.classList.toggle("delete-lesson__cancel-confirm-panel-content_hidden", !0), cancelPanelLoader.classList.toggle("delete-lesson__loader-container_hidden", !1), cancelConfirmButton.disabled = !0, switchToPanel(cancelConfirmPanel), $.ajax({
                type: "POST",
                url: model.countMatchingLessonsUrlTemplate,
                data: getCountConfirmationParameters(!1),
                dataType: "json",
                success: function(data) {
                    cancelConfirmPanelInfo.textContent = data.info, cancelConfirmPanelContent.classList.toggle("delete-lesson__cancel-confirm-panel-content_hidden", !1), cancelPanelLoader.classList.toggle("delete-lesson__loader-container_hidden", !0), cancelConfirmButton.disabled = !1
                },
                error: function() {
                    dnevnik.dialogs.error(model.errorMessage), switchToFiltersPanel()
                }
            })
        }), deleteButton.addEventListener("click", function() {
            deleteConfirmPanelContent.classList.toggle("delete-lesson__delete-confirm-panel-content_hidden", !0), deletePanelLoader.classList.toggle("delete-lesson__loader-container_hidden", !1), deleteConfirmButton.disabled = !0, switchToPanel(deleteConfirmPanel), $.ajax({
                type: "POST",
                url: model.countMatchingLessonsUrlTemplate,
                data: getCountConfirmationParameters(!0),
                dataType: "json",
                success: function(data) {
                    deleteConfirmPanelInfo.textContent = data.info, deleteConfirmPanelContent.classList.toggle("delete-lesson__delete-confirm-panel-content_hidden", !1), deletePanelLoader.classList.toggle("delete-lesson__loader-container_hidden", !0), deleteConfirmButton.disabled = !passwordInput.value
                },
                error: function() {
                    dnevnik.dialogs.error(model.errorMessage), switchToFiltersPanel()
                }
            })
        }), cancelCancelButton.addEventListener("click", function() {
            switchToFiltersPanel()
        }), deleteCancelButton.addEventListener("click", function() {
            switchToFiltersPanel()
        }), cancelConfirmButton.addEventListener("click", function() {
            "" !== reasonSelect.getSelectValue() ? runCancelTask() : dnevnik.dialogs.error(model.noReasonMessage)
        }), deleteConfirmButton.addEventListener("click", function() {
            runDeleteTask()
        }), errorPanelRetryButton.addEventListener("click", function() {
            switchToFiltersPanel()
        }), passwordInput.addEventListener("input", syncButtons)
    }
});
define("EditFinalWork/EditFinalWork", ["BlueBorderedPopup/BlueBorderedPopup", "utils/datetime", "dialogs/dialogs"], function(popup, dt) {
    "use strict";
    return function(model) {
        function showPopup() {
            popupDlg.showPopup()
        }

        function showPeriodWorkBlock() {
            attestationWorkBlock.style.display = "none", periodWorkBlock.style.display = "block"
        }

        function showAttestationWorkBlock() {
            attestationWorkBlock.style.display = "block", periodWorkBlock.style.display = "none"
        }

        function switchMode(e) {
            switch (workMode = e.target.value) {
                case "PeriodWork":
                    showPeriodWorkBlock();
                    break;
                case "AttestationWork":
                    showAttestationWorkBlock();
                    break;
                default:
                    workMode = null
            }
        }

        function setRadioButtonGroupCheck(radios, value) {
            !value && 0 < radios.length && (value = radios[0].value);
            for (var i = 0; i < radios.length; i++) radios[i].value == value ? (radios[i].setAttribute("checked", "checked"), radios[i].parentElement.classList.add("convex-radiobutton_checked")) : (radios[i].removeAttribute("checked"), radios[i].parentElement.classList.remove("convex-radiobutton_checked"))
        }

        function getRadioButtonGroupValue(radios) {
            for (var i = 0; i < radios.length; i++) {
                var radio = radios[i];
                if (radio.getAttribute("checked")) return radio.value
            }
            return null
        }

        function toggleRemoveMode(isRemoveMode) {
            isRemoveMode ? (editForm.style.display = "none", removeForm.style.display = "block") : (editForm.style.display = "block", removeForm.style.display = "none")
        }

        function hideRemovebutton(hide) {
            removeWorkButton.style.display = hide ? "none" : "block"
        }

        function disableMarkTypeRadios(disable) {
            for (var i = 0; i < markTypeRadios.length; i++) disable ? markTypeRadios[i].setAttribute("disabled", "disabled") : markTypeRadios[i].removeAttribute("disabled")
        }

        function toggleAddOrEditMode(isAddMode) {
            toggleRemoveMode(!1), isAddMode ? (addWorkHeader.style.display = "block", editWorkHeader.style.display = "none", workModeSwitch.style.display = "inline-block", workModeLabel.style.display = "none", function() {
                setRadioButtonGroupCheck(workModeRadios, "AttestationWork");
                for (var i = workModeRadios.length; i--;) workModeRadios[i].onclick = switchMode
            }()) : (addWorkHeader.style.display = "none", editWorkHeader.style.display = "block", workModeSwitch.style.display = "none", workModeLabel.style.display = "inline-block", function() {
                for (var labels = workModeLabel.querySelectorAll("span"), i = 0; i < labels.length; i++) labels[i].style.display = "none";
                workModeLabel.querySelector("#label-mode-" + workMode).style.display = "block"
            }())
        }

        function showErrors(errorBlock, errors) {
            errorBlock.innerHTML = "";
            for (var i = 0; i < errors.length; i++) {
                var errorDiv = document.createElement("div");
                errorDiv.innerHTML = errors[i], errorBlock.appendChild(errorDiv)
            }
        }

        function hideAllErrors() {
            showErrors(periodErrorBlock, []), showErrors(timeErrorsBlock, []), showErrors(dateErrorsBlock, [])
        }

        function validateForm(workMode, result) {
            switch (result = 0 < result, workMode) {
                case "PeriodWork":
                    result = function() {
                        var errors = [],
                            periodFrom = periodFromCalendar.getDate(periodFromDate.value);
                        periodFrom ? (periodFrom < minDate || maxDate < periodFrom) && errors.push(model.periodFromRangeError) : errors.push(model.periodFromError);
                        var periodTo = periodToCalendar.getDate(periodToDate.value);
                        return periodTo ? periodTo < minDate || maxDate < periodTo ? errors.push(model.periodToRangeError) : periodTo < periodFrom && errors.push(model.periodToError) : errors.push(model.periodToError), showErrors(periodErrorBlock, errors), 0 === errors.length
                    }();
                    break;
                case "AttestationWork":
                    result = function() {
                        var timeErrors = [],
                            dateErrors = [],
                            timeFromString = timeFrom.value,
                            timeToString = timeTo.value;
                        !timeFromString && timeToString && timeErrors.push(model.timeFromError), !timeToString && timeFromString && timeErrors.push(model.timeToError);
                        var timeFromValue = dt.getMinutesOffsetFromTimeString(timeFromString),
                            dateValue = dt.getMinutesOffsetFromTimeString(timeToString);
                        timeToString && timeFromString && (timeFromValue === dateValue || dateValue < timeFromValue && 0 < dateValue) && timeErrors.push(model.timeRangeError);
                        dateValue = dateInputCalendar.getDate(dateInput.value);
                        return dateValue ? (dateValue < minDate || maxDate < dateValue) && dateErrors.push(model.dateRangeError) : dateErrors.push(model.dateError), showErrors(timeErrorsBlock, timeErrors), showErrors(dateErrorsBlock, dateErrors), 0 === timeErrors.length && 0 === dateErrors.length
                    }()
            }
            return result
        }

        function fillDialogData(data, timeToMinutes) {
            switch (workTypeSelector.value = data.work.workTypeId, setRadioButtonGroupCheck(markTypeRadios, data.work.markType), workHasMarks = data.workHasMarks, hideRemovebutton(workHasMarks), disableMarkTypeRadios(workHasMarks), function(workType) {
                for (var k = 0; k < workTypeSelector.options.length; k++) {
                    var option = workTypeSelector.options[k];
                    workType == option.value && (option.selected = !0, removeForm.querySelector(".b-reports-label .work-name-placeholder").textContent = option.label)
                }
            }(data.work.workTypeId), timeToMinutes) {
                case "PeriodWork":
                    periodFromDate.value = dt.getDateString(data.work.periodStartDate), periodToDate.value = dt.getDateString(data.work.periodFinishDate), showPeriodWorkBlock();
                    break;
                case "AttestationWork":
                    dateInput.value = dt.getDateString(data.work.workDate), data.work.durationMinutes ? (timeFrom.value = dt.getTimeStringFromMinutesOffset(data.work.startDayMinutesOffset), timeToMinutes = data.work.startDayMinutesOffset + data.work.durationMinutes, timeTo.value = dt.getTimeStringFromMinutesOffset(timeToMinutes, !0)) : (timeFrom.value = "", timeTo.value = ""), placeSelector.value = data.work.placeId, showAttestationWorkBlock()
            }
            showPopup()
        }
        var workHasMarks, workId = null,
            workMode = null,
            showDlgButton = document.getElementById(model.editFinalWorkLink),
            closePopup = document.getElementById(model.editWorkContainerId),
            editForm = closePopup.querySelector("#" + model.editFormId),
            submitButton = editForm.querySelector("#" + model.submitId),
            cancelButton = editForm.querySelector("#" + model.cancelId),
            closeButton = editForm.querySelector("#" + model.cancelId),
            removeForm = closePopup.querySelector("#" + model.removeFormId),
            confirmRemoveButton = removeForm.querySelector("#" + model.submitId),
            cancelRemoveButton = removeForm.querySelector("#" + model.cancelId),
            links = document.querySelectorAll(model.subscribeSelector),
            removeWorkButton = editForm.querySelector("#" + model.removeWorkButtonId),
            periodWorkBlock = closePopup.querySelector("#" + model.periodWorkBlockId),
            attestationWorkBlock = closePopup.querySelector("#" + model.attestationWorkBlockId),
            periodFromDate = closePopup.querySelector("#" + model.periodFromId),
            periodToDate = closePopup.querySelector("#" + model.periodToId),
            addWorkHeader = closePopup.querySelector("#" + model.addWorkHeaderContainerId),
            editWorkHeader = closePopup.querySelector("#" + model.editWorkHeaderContainerId),
            workModeSwitch = editForm.querySelector("#" + model.switchModeId),
            workModeLabel = editForm.querySelector("#" + model.labelModeId),
            workModeRadios = editForm.querySelectorAll("[name=finalWorkMode]"),
            markTypeRadios = editForm.querySelectorAll("[name=markType]"),
            periodFromCalendar = $(periodFromDate).calendar,
            periodToCalendar = $(periodToDate).calendar,
            dateInput = editForm.querySelector("#" + model.dateId),
            dateInputCalendar = $(dateInput).calendar,
            timeFrom = editForm.querySelector("#" + model.timeFromId),
            timeTo = editForm.querySelector("#" + model.timeToId),
            minDate = dateInputCalendar.getDate(dateInputCalendar.settings.fromDate),
            maxDate = dateInputCalendar.getDate(dateInputCalendar.settings.toDate),
            workTypeSelector = editForm.querySelector("[name=workType]"),
            placeSelector = editForm.querySelector("[name=place]"),
            periodErrorBlock = periodWorkBlock.querySelector("#period-errors"),
            timeErrorsBlock = attestationWorkBlock.querySelector("#time-errors"),
            dateErrorsBlock = attestationWorkBlock.querySelector("#date-errors"),
            popupDlg = new popup({
                id: model.popupId
            }),
            serverErrorMessage = model.tryAgainError,
            closePopup = function(e) {
                return e.preventDefault(), e.stopPropagation(), popupDlg.hidePopUp(), !1
            },
            submitting = !1,
            loadAddDialog = function() {
                toggleAddOrEditMode(!(workMode = workId = null)), hideRemovebutton(!0), disableMarkTypeRadios(!1), showAttestationWorkBlock(), hideAllErrors(), setRadioButtonGroupCheck(markTypeRadios, model.defaultMarkTypeId), periodFromDate.value = "", periodToDate.value = "", timeFrom.value = "", timeTo.value = "", dateInput.value = ""
            };
        cancelButton.addEventListener("click", closePopup), closeButton.addEventListener("click", closePopup), showDlgButton && showDlgButton.addEventListener("click", function(e) {
            return e.preventDefault(), e.stopPropagation(), loadAddDialog(), showPopup(), !1
        }), removeWorkButton.addEventListener("click", function() {
            toggleRemoveMode(!0)
        }), confirmRemoveButton.addEventListener("click", function(data) {
            var dialogs;
            data.preventDefault(), data.stopPropagation(), !0 !== submitting && (submitting = !0, data = {
                xss: model.csrfToken,
                workId: workId,
                mode: workMode,
                groupId: model.groupId
            }, dialogs = dnevnik.dialogs, $.ajax({
                type: "POST",
                url: model.removeWorkUrl,
                dataType: "json",
                data: data,
                async: !0,
                success: function(data) {
                    !0 !== data.success ? (!1 === data.success ? dialogs.error(model.tryAgainRemoveError) : dialogs.error(serverErrorMessage), submitting = !1) : window.location.reload()
                },
                error: function() {
                    dialogs.error(serverErrorMessage), submitting = !1
                }
            }))
        }), cancelRemoveButton.addEventListener("click", closePopup), submitButton.addEventListener("click", function(markType) {
            var workType, data, dialogs;
            markType.preventDefault(), markType.stopPropagation(), !0 !== submitting && (submitting = !0, workType = workTypeSelector.options[workTypeSelector.selectedIndex].value, data = placeSelector.options[placeSelector.selectedIndex] ? placeSelector.options[placeSelector.selectedIndex].value : null, markType = getRadioButtonGroupValue(markTypeRadios), workMode = workMode || getRadioButtonGroupValue(workModeRadios), validateForm(workMode, workType) ? (data = {
                xss: model.csrfToken,
                workId: workId,
                groupId: model.groupId,
                schoolId: model.schoolId,
                subjectId: model.subject.subjectId,
                workType: workType,
                finalWorkMode: workMode,
                markType: markType,
                periodStartDate: periodFromDate.value,
                periodFinishDate: periodToDate.value,
                date: dateInput.value,
                timeFrom: dt.getMinutesOffsetFromTimeString(timeFrom.value),
                timeTo: dt.getMinutesOffsetFromTimeString(timeTo.value, !0),
                placeId: data
            }, dialogs = dnevnik.dialogs, $.ajax({
                type: "POST",
                url: model.editWorkUrl,
                dataType: "json",
                data: data,
                async: !0,
                success: function(data) {
                    !0 !== data.success ? (!1 === data.success ? dialogs.error(model.tryAgainEditError) : dialogs.error(serverErrorMessage), submitting = !1) : window.location.reload()
                },
                error: function() {
                    dialogs.error(serverErrorMessage), submitting = !1
                }
            })) : submitting = !1)
        });
        for (var i = 0; i < links.length; i++) links[i].addEventListener("click", function(target) {
            target = target.currentTarget, workId = target.getAttribute("data-work"), workMode = target.getAttribute("data-mode"), hideAllErrors(), toggleAddOrEditMode(!1), $.ajax({
                type: "GET",
                url: model.getWorkUrl,
                dataType: "json",
                data: {
                    groupId: model.groupId,
                    workId: workId,
                    mode: workMode
                },
                async: !0,
                success: function(data) {
                    !0 === data.success ? fillDialogData(data, workMode) : !1 === data.success ? dialogs.error(data.errorDescription || serverErrorMessage) : dialogs.error(serverErrorMessage), submitting = !1
                },
                error: function() {
                    dialogs.error(serverErrorMessage), submitting = !1
                }
            })
        })
    }
});
define("GroupDigitalReportTable/GroupDigitalReportTable", ["utils/forcenumberinput"], function() {});
define("JournalPrintingWizard/JournalPrintingWizard", ["doculiteMetrika"], function(metrika) {
    "use strict";
    return function(model) {
        var doculiteButton = document.getElementById(model.id),
            closeButton = doculiteButton.querySelector(".journal-printing-wizard__exit-button"),
            subjectOrderControlContainer = doculiteButton.querySelector(".journal-printing-wizard__subjects-order-root-container"),
            submitButton = doculiteButton.querySelector(".journal-printing-wizard__submit-button"),
            doculiteButton = doculiteButton.querySelector(".journal-printing-wizard__doculite-button");

        function submitAndPrint(form) {
            var input = subjectOrderControlContainer.firstElementChild.subjectList.getSettings(),
                printUrl = JSON.stringify(input),
                input = new XMLHttpRequest;
            input.withCredentials = !0, input.open("POST", model.saveSettingsUrl, !0), input.setRequestHeader("Content-Type", "application/json"), input.send(printUrl);
            input = document.createElement("textarea");
            input.name = "subjectSettings", input.value = printUrl;
            printUrl = model.printUrl;
            !0 === form && (printUrl += "&doculiteMode=true");
            form = document.createElement("form");
            form.action = printUrl, form.method = "POST", form.target = "_blank", form.appendChild(input), form.style.display = "none", document.body.appendChild(form), form.submit(), document.body.removeChild(form)
        }

        function closeWizardHandler(parentWindow) {
            parentWindow.preventDefault(), (parentWindow = window.parent) && parentWindow.postMessage("close-wizard-window", "*")
        }
        submitButton.addEventListener("click", function(e) {
            e.preventDefault(), submitAndPrint()
        }), doculiteButton && doculiteButton.addEventListener("click", function(e) {
            e.preventDefault(), metrika.send("journal-print", model.userRolesForMetrika), submitAndPrint(!0)
        }), closeButton.addEventListener("click", closeWizardHandler), document.addEventListener("keydown", function(e) {
            27 === e.keyCode && closeWizardHandler(e)
        })
    }
});
define("EditWork/EditWork", ["BlueBorderedPopup/BlueBorderedPopup", "dialogs/dialogs"], function(popup) {
    "use strict";
    return function(model) {
        var work, canRemove, closePopup = document.querySelector("#" + model.containerId),
            addContainer = closePopup.querySelector("#" + model.addWorkContainerId),
            editContainer = closePopup.querySelector("#" + model.editWorkContainerId),
            removeContainer = closePopup.querySelector("#" + model.removeWorkContainerId),
            editForm = editContainer.querySelector("#" + model.editFormId),
            links = document.querySelectorAll(model.subscribeSelector),
            table = document.querySelector(model.markTableSelector),
            submitButton = editContainer.querySelector("#" + model.submitId),
            cancelButton = editContainer.querySelector("#" + model.cancelId),
            closeButton = addContainer.querySelector("#" + model.cancelId),
            removeButton = closePopup.querySelector("#" + model.removeWorkButtomId),
            popupDlg = new popup({
                id: model.popupId
            }),
            closePopup = function(e) {
                return e.preventDefault(), e.stopPropagation(), popupDlg.hidePopUp(), !1
            };
        cancelButton.addEventListener("click", closePopup), closeButton.addEventListener("click", closePopup);

        function checkCanRemove(data) {
            data = {
                xss: model.csrfToken,
                workId: data,
                groupId: model.groupId
            }, $.ajax({
                type: "POST",
                url: model.canRemoveUrl,
                dataType: "json",
                data: data,
                async: !1,
                success: function(data) {
                    canRemove = data.CanRemove
                },
                error: function() {
                    canRemove = !1
                }
            })
        }

        function hideAllPanels() {
            addContainer.style.display = "none", editContainer.style.display = "none", removeContainer.style.display = "none", editForm.style.display = "block", removeButton.style.display = canRemove ? "block" : "none"
        }

        function showEdit() {
            hideAllPanels(), editContainer.style.display = "block"
        }
        removeButton.addEventListener("click", function(e) {
            return e.preventDefault(), e.stopPropagation(), checkCanRemove(work), canRemove ? (showEdit(), editForm.style.display = "none", removeContainer.style.display = "block", removeButton.style.display = "none") : dnevnik.dialogs.error(model.tryRemoveAgainError), !1
        });

        function initializeContainer(target) {
            function dataset(name) {
                return target.dataset && target.dataset[name] || target.getAttribute("data-" + name)
            }
            var lesson = dataset("lesson"),
                lessonInfo = dataset("lessondate");
            work = dataset("work"), checkCanRemove(work);
            var workType = work && dataset("worktype") || model.defaultWorkTypeId,
                markType = work && dataset("marktype") || model.defaultMarkTypeId,
                lessonInfo = model.subjectName + ", " + lessonInfo;
            addContainer.querySelector(".lesson-description").textContent = lessonInfo, editContainer.querySelector(".lesson-description").textContent = lessonInfo, editForm.querySelector("[name=lessonId]").value = lesson, editForm.querySelector("[name=workId]").value = work || null;
            for (var select = editForm.querySelector("[name=workType]"), k = 0; k < select.options.length; k++) {
                var option = select.options[k];
                workType == option.value && (option.selected = !0, removeContainer.querySelector(".b-reports-label .work-name-placeholder").textContent = option.label)
            }
            for (var canEditMarkType = function(data) {
                    if (null == data) return !0;
                    var result, data = {
                        xss: model.csrfToken,
                        workId: data,
                        groupId: model.groupId
                    };
                    return $.ajax({
                        type: "POST",
                        url: model.canEditMarkTypeUrl,
                        dataType: "json",
                        data: data,
                        async: !1,
                        success: function(data) {
                            result = data.CanEditMarkType
                        },
                        error: function() {
                            result = !1
                        }
                    }), result
                }(work), radios = editForm.querySelectorAll("[name=markType]"), i = 0; i < radios.length; i++) - 1 < model.markSystems.indexOf(parseInt(radios[i].value)) || radios[i].value == markType ? radios[i].parentNode.style.display = "block" : radios[i].parentNode.style.display = "none", canEditMarkType ? radios[i].removeAttribute("disabled") : radios[i].setAttribute("disabled", "disabled"), markType && radios[i].value == markType ? (radios[i].setAttribute("checked", "checked"), radios[i].parentElement.classList.add("convex-radiobutton_checked")) : (radios[i].removeAttribute("checked"), radios[i].parentElement.classList.remove("convex-radiobutton_checked"));
            work ? showEdit() : (hideAllPanels(), addContainer.style.display = "block")
        }
        addContainer.querySelector(".add-work").addEventListener("click", showEdit);
        for (var i = 0; i < links.length; i++) links[i].addEventListener("click", function(e) {
            initializeContainer(e.currentTarget), popupDlg.showPopup()
        });
        var submitting = !1;
        submitButton.addEventListener("click", function(workTypeSelector) {
            if (workTypeSelector.preventDefault(), workTypeSelector.stopPropagation(), !0 !== submitting) {
                submitting = !0;
                var data = {
                    xss: model.csrfToken,
                    groupId: model.groupId
                };
                data.lessonId = editForm.querySelector("[name=lessonId]").value;
                var workTypeSelector = editForm.querySelector("[name=workId]").value,
                    errorMessage = model.tryAgainError;
                workTypeSelector && (data.workId = workTypeSelector, data.isRemoveAction = "none" !== removeContainer.style.display, data.isRemoveAction && (errorMessage = model.tryRemoveAgainError));
                workTypeSelector = editForm.querySelector("[name=workType]");
                data.workType = workTypeSelector.options[workTypeSelector.selectedIndex].value;
                for (var radios = editForm.querySelectorAll("[name=markType]"), i = 0; i < radios.length; i++) {
                    var radio = radios[i];
                    if (radio.checked && "disabled" !== radio.getAttribute("disabled")) {
                        data.markType = radio.value;
                        break
                    }
                }
                var dialogs = dnevnik.dialogs;
                $.ajax({
                    type: "POST",
                    url: model.editWorkUrl,
                    dataType: "json",
                    data: data,
                    async: !0,
                    success: function(data) {
                        if (!0 === data.success) return window.location.hash = "scrollJournal=" + table.scrollLeft, void window.location.reload();
                        !1 === data.success ? dialogs.error(data.errorDescription || errorMessage) : dialogs.error(errorMessage), submitting = !1
                    },
                    error: function() {
                        dialogs.error(errorMessage), submitting = !1
                    }
                })
            }
        })
    }
});
define("JournalTooltip/JournalTooltip", function() {
    "use strict";
    return function(wrapper) {
        var wrapper = wrapper.id,
            wrapper = document.getElementById(wrapper),
            hinticon = wrapper.querySelector(".journal-tooltip__icon"),
            hintPopover = wrapper.querySelector(".journal-tooltip__popover");
        hintPopover && document.getElementsByTagName("body")[0].addEventListener("mousedown", function(e) {
            hinticon.classList.contains("journal-tooltip__icon_active") && e.target !== hintPopover && ! function(c, p) {
                for (;
                    (c = c.parentNode) && c !== p;);
                return c
            }(e.target, hintPopover) ? (hintPopover.classList.remove("journal-tooltip__popover_active"), hinticon.classList.remove("journal-tooltip__icon_active")) : hinticon === e.target && (hintPopover.classList.add("journal-tooltip__popover_active"), hinticon.classList.add("journal-tooltip__icon_active"), hintPopover.focus(), e.preventDefault())
        })
    }
});
define("JournalTable/JournalTable", function() {
    "use strict";
    return function(model) {
        function lessonHeldClick(lessonId) {
            var dialogs = dnevnik.dialogs,
                chbx = lessonId.target;
            chbx && (lessonId = chbx.dataset.lessonId, chbx.disabled = !0, $.ajax({
                type: "POST",
                url: model.setLessonHeldUrl,
                dataType: "json",
                data: {
                    xss: model.csrfToken,
                    lessonId: lessonId,
                    groupId: model.groupId,
                    isHeld: chbx.checked
                },
                success: function(data) {
                    if (!1 === data.success) return dialogs.error(data.errorDescription || errorMessage), void(chbx.checked = !chbx.checked);
                    data && data.success || (dialogs.error(errorMessage), chbx.checked = !chbx.checked)
                },
                error: function() {
                    dialogs.error(errorMessage), chbx.checked = !chbx.checked
                },
                complete: function() {
                    chbx.disabled = !1
                }
            }))
        }
        var scrollPos = document.getElementById(model.id),
            header = scrollPos.getElementsByClassName("journal-table__right-column__head-row")[0],
            students = scrollPos.getElementsByClassName("journal-table__left-column__students")[0],
            mainArea = scrollPos.getElementsByClassName("journal-table__right-column__main-area")[0],
            table = mainArea.getElementsByClassName("journal-table__table")[0],
            errorMessage = model.errorMessage;
        header.querySelectorAll(".blue-checkbox__input[name='journal-table__thead-cell__lessonheld']").forEach(function(chbx) {
            chbx.addEventListener("change", lessonHeldClick)
        });
        var scrollBarWidth = function() {
                var w2 = document.createElement("p");
                w2.style.width = "100%", w2.style.height = "200px";
                var outer = document.createElement("div");
                outer.style.position = "absolute", outer.style.top = "0px", outer.style.left = "0px", outer.style.visibility = "hidden", outer.style.width = "200px", outer.style.height = "150px", outer.style.overflow = "hidden", outer.appendChild(w2), document.body.appendChild(outer);
                var w1 = w2.offsetWidth;
                outer.style.overflow = "scroll";
                w2 = w2.offsetWidth;
                return w1 == w2 && (w2 = outer.clientWidth), document.body.removeChild(outer), w1 - w2
            }(),
            scrollPos = function() {
                var availableSize = window.innerHeight - mainArea.getBoundingClientRect().top - scrollBarWidth,
                    requiredSize = mainArea.scrollHeight + scrollBarWidth,
                    requiredSize = Math.min(requiredSize, availableSize - 1);
                mainArea.style.height = requiredSize + "px", students.style.height = requiredSize - scrollBarWidth + "px";
                availableSize = window.innerWidth - students.getBoundingClientRect().right - scrollBarWidth, requiredSize = table.getBoundingClientRect().width + scrollBarWidth + 1;
                mainArea.style.maxWidth = Math.min(availableSize, requiredSize) + "px", header.style.maxWidth = mainArea.getBoundingClientRect().width - scrollBarWidth - 1 + "px"
            };
        window.addEventListener("resize", scrollPos), mainArea.addEventListener("scroll", function() {
            header.scrollLeft = mainArea.scrollLeft, students.scrollTop = mainArea.scrollTop
        }), scrollPos();
        scrollPos = window.location.hash;
        !scrollPos || null != (scrollPos = (scrollPos = /^#?scrollJournal=(\d+)$/.exec(scrollPos)) && scrollPos[1] && parseInt(scrollPos[1])) && (header.scrollLeft = scrollPos, mainArea.scrollLeft = scrollPos, window.location.hash = "")
    }
});
define("MetaGroupJournalTable/MetaGroupJournalTable", ["JournalTable/JournalTable"], function(journalTable) {
    "use strict";
    return journalTable
});
define("MetaGroupMarksTable/MetaGroupMarksTable", ["journalTable/journalTable", "dialogs/dialogs"], function(journalTable) {
    "use strict";
    var dialogs = dnevnik.dialogs;
    return function(model) {
        var table = document.getElementById(model.tableId),
            journalModel = {
                tableClass: "." + model.tableClass,
                cellClass: model.cellClass,
                disabledCellClass: model.disabledCellClass,
                eliminatedCellClass: model.eliminatedCellClass,
                inputLength: 10,
                inputClass: model.inputClass,
                onEdit: function(input, cellContent, restore, callback) {
                    $.ajax({
                        type: "POST",
                        url: "/odo/journals/journalmark/editmark/" + input.parentElement.getAttribute("data-school") + "/group/" + input.parentElement.getAttribute("data-group"),
                        dataType: "json",
                        data: {
                            personId: input.parentElement.getAttribute("data-person"),
                            workId: input.parentElement.getAttribute("data-work"),
                            mark: input.value
                        },
                        async: !0,
                        success: function(data) {
                            if (!0 === data.success) return function(marksHtml, cellContent, data) {
                                if (marksHtml.parentElement === cellContent.parentElement && journalTable.dropSelection(!0), cellContent.setAttribute("data-mark", data.complexMark || ""), data.lessonId && cellContent.parentElement && "True" !== cellContent.parentElement.getAttribute("data-ishomework"))
                                    for (var worksOnLesson = table.querySelectorAll('td[data-lesson="' + data.lessonId + '"][data-person="' + data.personId + '"]:not([data-hideappearance="true"]) .' + model.appearanceClass), i = 0; i < worksOnLesson.length; i++) worksOnLesson[i].innerHTML = data.appearance || "";
                                var marks = cellContent.getElementsByClassName(model.markClass)[0],
                                    marksHtml = "";
                                data.firstMark && (marksHtml += '<span class="' + model.markItemClass + " " + model.markItemClass + "_" + data.firstMark.color + '">' + data.firstMark.value + "</span>", data.secondMark && (marksHtml += '/<span class="' + model.markItemClass + " " + model.markItemClass + "_" + data.secondMark.color + '">' + data.secondMark.value + "</span>")), marks.innerHTML = marksHtml, cellContent.style.display = "block"
                            }(input, cellContent, data), void(callback && callback());
                            dialogs.error(data.error || model.tryAgainError), restore()
                        },
                        error: function() {
                            dialogs.error(model.tryAgainError), restore()
                        }
                    })
                }
            };
        journalTable.init(journalModel)
    }
});
define("PeriodDateSelector/PeriodDateSelector", ["utils/domready"], function(domready) {
    "use strict";
    return function(model) {
        var settings, defaultFromValue, defaultToValue, minDate, maxDate, controlContainer = $("#" + model.generatedId),
            errorClassName = "b-reports-input-wrapper_error",
            inputErrorClassName = "b-reports-input_error",
            dateInputFrom = controlContainer.find("#" + model.modelFrom.clientId),
            dateInputTo = controlContainer.find("#" + model.modelTo.clientId);

        function validateInterval(event) {
            var dateFrom, isValid = dateInputFrom.val(),
                dateInputToVal = dateInputTo.val();
            "" !== isValid && "" !== dateInputToVal && (dateFrom = dateInputFrom.calendar.getDate(isValid), isValid = !0, dateInputTo.calendar.getDate(dateInputToVal) < dateFrom ? (isValid = !1, event.parent().addClass(errorClassName), event.addClass(inputErrorClassName)) : (dateInputFrom.parent().removeClass(errorClassName), dateInputTo.parent().removeClass(errorClassName), dateInputFrom.removeClass(inputErrorClassName), dateInputTo.removeClass(inputErrorClassName)), 0 < controlContainer.length && ((event = document.createEvent("CustomEvent")).initCustomEvent("intervalvalidated", !0, !0, {
                isValid: isValid
            }), controlContainer[0].dispatchEvent(event)))
        }

        function validateDate(dateInput, limitDateStr) {
            var date = dateInput.val();
            "" !== date && (!1 !== minDate && !1 !== maxDate && (!1 === (date = dateInput.calendar.getDate(date)) || date instanceof Date && (date < minDate || maxDate < date)) && dateInput.calendar.setDate(limitDateStr, dateInput), setTimeout(function() {
                validateInterval(dateInput)
            }, 100))
        }

        function validateDateFrom() {
            validateDate(dateInputFrom, defaultFromValue)
        }

        function validateDateTo() {
            validateDate(dateInputTo, defaultToValue)
        }
        controlContainer[0].addEventListener("validateValues", function() {
            validateDateFrom(), validateDateTo()
        }), domready(function() {
            settings = dateInputFrom.calendar.settings, defaultFromValue = dateInputFrom.val(), defaultToValue = dateInputTo.val(), minDate = dateInputFrom.calendar.getDate(settings.fromDate), maxDate = dateInputFrom.calendar.getDate(settings.toDate), dateInputFrom.length && dateInputTo.length && (dateInputFrom.blur(function() {
                validateDateFrom()
            }), dateInputTo.blur(function() {
                validateDateTo()
            }), dateInputFrom[0].addEventListener("DateSelected", function() {
                validateInterval(dateInputFrom)
            }, !1), dateInputTo[0].addEventListener("DateSelected", function() {
                validateInterval(dateInputTo)
            }, !1), validateDateFrom(), validateDateTo())
        })
    }
});
define("PrintJournalLoader/PrintJournalLoader", ["async/polling", "Popup/Popup", "dialogs/dialogs"], function(polling, Popup) {
    "use strict";
    return function(model) {
        function error(errorMessage) {
            popupDlg.hidePopup(), dnevnik.dialogs.error(errorMessage)
        }
        var popupDlg = new Popup({
            id: model.popup.id
        });
        $.ajax({
            type: "GET",
            url: model.handlerUrl,
            dataType: "json",
            success: function(data) {
                polling.start({
                    taskID: data.taskId,
                    taskStateHandlerUrl: model.stateHandlerUrl,
                    success: function() {
                        popupDlg.hidePopup(), document.location.href = data.getResultUri
                    },
                    error: function() {
                        error(model.popupErrorMessage)
                    }
                })
            },
            error: function() {
                error(model.popupErrorMessage)
            }
        })
    }
});
define("ReplaceTeacher/ReplaceTeacher", ["async/polling", "dialogs/dialogs"], function(polling, dialogs) {
    "use strict";
    return function(model) {
        var cancelButton = document.getElementById(model.id),
            filtersPanel = cancelButton.querySelector(".replace-teacher__filters-panel"),
            confirmPanel = cancelButton.querySelector(".replace-teacher__confirm-panel"),
            confirmPanelContent = confirmPanel.querySelector(".replace-teacher__confirm-panel-content"),
            confirmPanelInfo = confirmPanel.querySelector(".replace-teacher__confirm-panel-info"),
            confirmPanelLoader = confirmPanel.querySelector(".replace-teacher__loader-container"),
            confirmPanelReason = confirmPanel.querySelector(".replace-teacher__confirm-panel-reason"),
            runTaskPanel = cancelButton.querySelector(".replace-teacher__run-task-panel"),
            errorPanel = cancelButton.querySelector(".replace-teacher__error-panel"),
            errorPanelRetryButton = cancelButton.querySelector(".replace-teacher__retry-button"),
            teacherToReplaceSelect = document.getElementById(model.teacherToReplaceSelectId),
            newTeacherSelect = document.getElementById(model.newTeacherSelectId),
            subjectSelect = document.getElementById(model.subjectSelectId),
            groupSelect = document.getElementById(model.groupSelectId),
            subgroupSelect = document.getElementById(model.subgroupSelectId),
            isCancellationReasonText = model.isCancellationReasonText,
            cancelReason = isCancellationReasonText ? document.getElementById(model.reasonTextareaId) : document.getElementById(model.reasonSelectId),
            periodToTheEndOfYearInput = cancelButton.querySelector("input[name=period][value=toTheEndOfYear]"),
            periodFromToInput = cancelButton.querySelector("input[name=period][value=fromTo]"),
            periodDateStartInput = cancelButton.querySelector("input[name=dateStart]"),
            periodDateFinishInput = cancelButton.querySelector("input[name=dateFinish]"),
            changeTypeMarkAsChangeInput = cancelButton.querySelector("input[name=changeType][value=markAsChange]"),
            changeTypeDoNotMarkInput = cancelButton.querySelector("input[name=changeType][value=doNotMark]"),
            saveButton = cancelButton.querySelector(".replace-teacher__save-button"),
            confirmButton = cancelButton.querySelector(".replace-teacher__confirm-button"),
            cancelButton = cancelButton.querySelector(".replace-teacher__cancel-button");

        function switchToPanel(panel) {
            filtersPanel.classList.toggle("replace-teacher__panel_inactive", panel !== filtersPanel), confirmPanel.classList.toggle("replace-teacher__panel_inactive", panel !== confirmPanel), runTaskPanel.classList.toggle("replace-teacher__panel_inactive", panel !== runTaskPanel), errorPanel.classList.toggle("replace-teacher__panel_inactive", panel !== errorPanel)
        }

        function switchToFiltersPanel() {
            switchToPanel(filtersPanel)
        }

        function switchToConfirmPanel() {
            confirmPanelContent.classList.toggle("replace-teacher__confirm-panel-content_hidden", !0), confirmPanelLoader.classList.toggle("replace-teacher__loader-container_hidden", !1), confirmPanelReason.classList.toggle("replace-teacher__confirm-panel-reason_hidden", !changeTypeMarkAsChangeInput.checked), confirmButton.disabled = !0, switchToPanel(confirmPanel), $.ajax({
                type: "POST",
                url: model.countMatchingLessonsUrlTemplate,
                data: {
                    teacherId: teacherToReplaceSelect.getSelectValue(),
                    subjectId: subjectSelect.getSelectValue(),
                    groupId: groupSelect.getSelectValue(),
                    subgroupId: subgroupSelect.getSelectValue(),
                    toTheEndOfStudyYear: periodToTheEndOfYearInput.checked,
                    startDate: periodFromToInput.checked ? periodDateStartInput.value : null,
                    finishDate: periodFromToInput.checked ? periodDateFinishInput.value : null
                },
                dataType: "json",
                success: function(data) {
                    confirmPanelInfo.textContent = data.info, confirmPanelContent.classList.toggle("replace-teacher__confirm-panel-content_hidden", !1), confirmPanelLoader.classList.toggle("replace-teacher__loader-container_hidden", !0), confirmButton.disabled = !1
                },
                error: function() {
                    dnevnik.dialogs.error(model.errorMessage), switchToFiltersPanel()
                }
            })
        }

        function runReplaceTask() {
            switchToPanel(runTaskPanel), $.ajax({
                type: "POST",
                url: model.startReplaceLessonsTaskUrlTemplate,
                data: {
                    teacherToReplaceId: teacherToReplaceSelect.getSelectValue(),
                    newTeacherId: newTeacherSelect.getSelectValue(),
                    teacherId: teacherToReplaceSelect.getSelectValue(),
                    subjectId: subjectSelect.getSelectValue(),
                    groupId: groupSelect.getSelectValue(),
                    subgroupId: subgroupSelect.getSelectValue(),
                    toTheEndOfStudyYear: periodToTheEndOfYearInput.checked,
                    startDate: periodFromToInput.checked ? periodDateStartInput.value : null,
                    finishDate: periodFromToInput.checked ? periodDateFinishInput.value : null,
                    markAsChange: changeTypeMarkAsChangeInput.checked,
                    changeReason: isCancellationReasonText ? cancelReason.value || "" : cancelReason.getSelectValue() || ""
                },
                dataType: "json",
                success: function(data) {
                    polling.start({
                        taskID: data.taskId,
                        taskStateHandlerUrl: model.taskStateHandlerUrl,
                        success: processSuccessfulReplaceTaskResult,
                        error: processReplaceTaskError
                    })
                },
                error: function() {
                    processReplaceTaskError()
                }
            })
        }

        function processSuccessfulReplaceTaskResult() {
            var parentWindow = window.parent;
            parentWindow && (parentWindow.postMessage("show-message:" + model.successMessage, "*"), parentWindow.postMessage("close-containing-modal", "*"))
        }

        function processReplaceTaskError() {
            switchToPanel(errorPanel)
        }

        function checkTeachersValid() {
            teacherToReplaceSelect.getSelectValue() === newTeacherSelect.getSelectValue() ? newTeacherSelect.markInvalid() : newTeacherSelect.clearInvalid()
        }

        function updateSelect(select, data, noDataMessage) {
            0 < data.length ? (select.update(data, 0, "id", "name"), select.enable()) : (select.update([], 0, null, null, noDataMessage), select.disable()), syncSaveButton()
        }

        function reloadGroupSelect() {
            groupSelect.disable(), subgroupSelect.disable();
            var teacherId = teacherToReplaceSelect.getSelectValue(),
                subjectId = subjectSelect.getSelectValue();
            !subjectId || subjectId <= 0 ? updateSelect(groupSelect, [], "") : $.ajax({
                type: "GET",
                url: model.listGroupsUrlTemplate.replace("{teacherId}", teacherId).replace("{subjectId}", subjectId),
                success: function(data) {
                    updateSelect(groupSelect, data, ""), reloadSubgroupSelect()
                },
                error: function() {
                    dnevnik.dialogs.error(model.errorMessage)
                }
            })
        }

        function reloadSubgroupSelect() {
            subgroupSelect.disable();
            var groupId = groupSelect.getSelectValue();
            !groupId || groupId <= 0 ? updateSelect(subgroupSelect, [], model.wholeGroupMessage) : $.ajax({
                type: "GET",
                url: model.listSubgroupsUrlTemplate.replace("{groupId}", groupId),
                success: function(data) {
                    updateSelect(subgroupSelect, data, model.wholeGroupMessage)
                },
                error: function() {
                    dnevnik.dialogs.error(model.errorMessage)
                }
            })
        }

        function syncSaveButton() {
            setTimeout(function() {
                var teacherToReplaceSelected = 0 < teacherToReplaceSelect.getSelectValue(),
                    newTeacherSelected = 0 < newTeacherSelect.getSelectValue() && teacherToReplaceSelect.getSelectValue() !== newTeacherSelect.getSelectValue(),
                    subjectSelected = 0 < subjectSelect.getSelectValue(),
                    groupSelected = 0 <= groupSelect.getSelectValue(),
                    subgroupSelected = 0 <= subgroupSelect.getSelectValue(),
                    canSave = periodFromToInput.checked && 0 < periodDateStartInput.value.length && 0 < periodDateFinishInput.value.length,
                    periodSelected = periodToTheEndOfYearInput.checked || canSave,
                    canSave = changeTypeMarkAsChangeInput.checked || changeTypeDoNotMarkInput.checked,
                    canSave = teacherToReplaceSelected && newTeacherSelected && subjectSelected && groupSelected && subgroupSelected && periodSelected && canSave;
                saveButton.disabled = !canSave
            }, 200)
        }
        teacherToReplaceSelect.change = function() {
            checkTeachersValid(),
                function() {
                    subjectSelect.disable(), groupSelect.disable(), subgroupSelect.disable();
                    var teacherId = teacherToReplaceSelect.getSelectValue();
                    $.ajax({
                        type: "GET",
                        url: model.listSubjectsUrlTemplate.replace("{teacherId}", teacherId),
                        success: function(data) {
                            updateSelect(subjectSelect, data, model.noSubjectsMessage), reloadGroupSelect()
                        },
                        error: function() {
                            dnevnik.dialogs.error(model.errorMessage)
                        }
                    })
                }(), syncSaveButton()
        }, newTeacherSelect.change = function() {
            checkTeachersValid(), syncSaveButton()
        }, subjectSelect.change = function() {
            reloadGroupSelect(), syncSaveButton()
        }, groupSelect.change = function() {
            reloadSubgroupSelect(), syncSaveButton()
        }, subgroupSelect.change = function() {
            syncSaveButton()
        }, periodDateStartInput.addEventListener("focus", function() {
            periodFromToInput.checked = !0, syncSaveButton()
        }), periodDateFinishInput.addEventListener("focus", function() {
            periodFromToInput.checked = !0, syncSaveButton()
        }), periodToTheEndOfYearInput.addEventListener("change", syncSaveButton), periodFromToInput.addEventListener("change", syncSaveButton), periodDateStartInput.addEventListener("change", syncSaveButton), periodDateStartInput.addEventListener("blur", syncSaveButton), periodDateFinishInput.addEventListener("change", syncSaveButton), periodDateFinishInput.addEventListener("blur", syncSaveButton), changeTypeMarkAsChangeInput.addEventListener("change", syncSaveButton), changeTypeDoNotMarkInput.addEventListener("change", syncSaveButton), saveButton.addEventListener("click", function() {
            switchToConfirmPanel()
        }), cancelButton.addEventListener("click", function() {
            switchToFiltersPanel()
        }), confirmButton.addEventListener("click", function() {
            !changeTypeMarkAsChangeInput.checked || isCancellationReasonText || "" !== cancelReason.getSelectValue() ? runReplaceTask() : dnevnik.dialogs.error(model.noReasonMessage)
        }), errorPanelRetryButton.addEventListener("click", function() {
            switchToFiltersPanel()
        })
    }
});
define("SubjectsOrder/SubjectsOrder", function() {
    "use strict";
    return function(root) {
        var root = document.getElementById(root.id),
            subjectList = root.querySelector(".subjects-order__subjects-list");

        function isCheckboxChecked(item, checkbox, def) {
            checkbox = item.querySelector('.subjects-order__subjects-list-item__checkboxes input[name="' + checkbox + '"]');
            return checkbox ? checkbox.checked : def
        }! function(source, sourceValue, target, targetValue) {
            for (var updateCheckbox = function(s, t) {
                    s.checked == sourceValue ? (t.checked = targetValue ? "checked" : null, t.disabled = "disabled") : t.disabled = null
                }, selectedSubjects = document.querySelectorAll(".subjects-order__subjects-list-item.subjects-order__subjects-list-item_grab"), i = 0; i < selectedSubjects.length; i += 1) {
                var targ = selectedSubjects[i],
                    src = targ.querySelector('.subjects-order__subjects-list-item__checkboxes input[name="' + source + '"]'),
                    targ = targ.querySelector('.subjects-order__subjects-list-item__checkboxes input[name="' + target + '"]');
                src && targ && src.addEventListener("change", updateCheckbox.bind(null, src, targ))
            }
        }("progress", !1, "choosable", !1),
        function() {
            var dragEl;
            [].slice.call(subjectList.children).forEach(function(e) {
                e.classList.contains("subjects-order__subjects-list-item") && !e.classList.contains("subjects-order__subjects-list-item_spacer") && (e.draggable = !0)
            });

            function onDragOver(e) {
                if (e.preventDefault(), e.dataTransfer.dropEffect = "copy", e.target && e.target !== dragEl && e.target.classList.contains("subjects-order__subjects-list-item")) {
                    var targetIncluded = e.target.getAttribute("data-include");
                    if ("true" !== dragEl.getAttribute("data-with-attestation") || "excluded" !== targetIncluded) {
                        if (e.target.classList.contains("subjects-order__subjects-list-item_spacer")) return subjectList.insertBefore(dragEl, e.target), void dragEl.setAttribute("data-include", targetIncluded);
                        dragEl.setAttribute("data-include", targetIncluded), dragEl.offsetTop < e.target.offsetTop ? subjectList.insertBefore(dragEl, e.target.nextSibling) : subjectList.insertBefore(dragEl, e.target)
                    }
                }
            }
            var onDragEnd = function(e) {
                    e.preventDefault(), e.stopPropagation && e.stopPropagation(), removeGrabbing(dragEl), subjectList.removeEventListener("dragover", onDragOver, !1), subjectList.removeEventListener("dragend", onDragEnd, !1)
                },
                removeGrabbing = function(e) {
                    var checkboxes;
                    e.classList.remove("subjects-order__subjects-list-item_grabbing"), e.classList.add("subjects-order__subjects-list-item_grab"), "false" === e.getAttribute("data-with-attestation") && (checkboxes = e.querySelector(".subjects-order__subjects-list-item__checkboxes"), "excluded" === e.getAttribute("data-include") ? checkboxes.classList.add("subjects-order__subjects-list-item__checkboxes_hidden") : checkboxes.classList.remove("subjects-order__subjects-list-item__checkboxes_hidden"))
                };
            subjectList.addEventListener("dragstart", function(e) {
                dragEl = e.target, e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("Text", dragEl.textContent), subjectList.addEventListener("dragover", onDragOver, !1), subjectList.addEventListener("dragend", onDragEnd, !1),
                    function(e) {
                        e.classList.remove("subjects-order__subjects-list-item_grab"), e.classList.add("subjects-order__subjects-list-item_grabbing")
                    }(dragEl)
            }, !1)
        }(), root.subjectList = {
            getSettings: function() {
                for (var selectedSubjects = subjectList.querySelectorAll(".subjects-order__subjects-list-item.subjects-order__subjects-list-item_grab"), subjects = [], i = 0; i < selectedSubjects.length; i += 1) {
                    var subject = selectedSubjects[i];
                    subjects.push(function(subject) {
                        return {
                            id: subject.getAttribute("data-id"),
                            isSelected: "included" === subject.getAttribute("data-include"),
                            isAbsenceDisabled: !isCheckboxChecked(subject, "absence", !0),
                            isAttendanceDisabled: !isCheckboxChecked(subject, "attendance", !0),
                            isProgressDisabled: !isCheckboxChecked(subject, "progress", !0),
                            isChoosableSubject: isCheckboxChecked(subject, "choosable", !1)
                        }
                    }(subject))
                }
                return subjects
            }
        }
    }
});
define("MarksTable/MarksTable", ["journalTable/journalTable", "dialogs/dialogs"], function(journalTable) {
    "use strict";
    var dialogs = dnevnik.dialogs;
    return function(model) {
        var table = document.getElementById(model.tableId),
            journalModel = {
                tableClass: ".journal-table",
                cellClass: model.cellClass,
                disabledCellClass: model.disabledCellClass,
                eliminatedCellClass: model.eliminatedCellClass,
                inputLength: 10,
                inputClass: model.inputClass,
                onEdit: function(input, cellContent, restore, callback) {
                    $.ajax({
                        type: "POST",
                        url: model.editMarkUrl,
                        dataType: "json",
                        data: {
                            personId: input.parentElement.getAttribute("data-person"),
                            workId: input.parentElement.getAttribute("data-work"),
                            mark: input.value
                        },
                        async: !0,
                        success: function(data) {
                            if (!0 === data.success) return function(marksHtml, cellContent, data) {
                                if (marksHtml.parentElement === cellContent.parentElement && journalTable.dropSelection(!0), cellContent.setAttribute("data-mark", data.complexMark || ""), data.lessonId)
                                    for (var worksOnLesson = table.querySelectorAll('td[data-lesson="' + data.lessonId + '"][data-person="' + data.personId + '"]:not([data-hideappearance="true"]) .' + model.appearanceClass), i = 0; i < worksOnLesson.length; i++) worksOnLesson[i].innerHTML = data.appearance || "";
                                var marks = cellContent.getElementsByClassName(model.markClass)[0],
                                    marksHtml = "";
                                data.firstMark && (marksHtml += '<span class="' + model.markItemClass + " " + model.markItemClass + "_" + data.firstMark.color + '">' + data.firstMark.value + "</span>", data.secondMark && (marksHtml += '/<span class="' + model.markItemClass + " " + model.markItemClass + "_" + data.secondMark.color + '">' + data.secondMark.value + "</span>")), marks.innerHTML = marksHtml, cellContent.style.display = "block"
                            }(input, cellContent, data), void(callback && callback());
                            dialogs.error(data.error || model.tryAgainError), restore()
                        },
                        error: function() {
                            dialogs.error(model.tryAgainError), restore()
                        }
                    })
                }
            };
        journalTable.init(journalModel)
    }
});
define("SchedulesOrder/SchedulesOrder", function() {
    "use strict";
    return function(model) {
        document.getElementById(model.id)
    }
});
define("NavigationWizard/NavigationWizard", function() {
    "use strict";
    return function(prevPageButtons) {
        function switchPage(targetPage) {
            var activePage = root.querySelector(".navigation-wizard__page_active"),
                targetPage = parseInt(activePage.getAttribute("data-page-number")) + targetPage;
            (targetPage = root.querySelector('.navigation-wizard__page[data-page-number="' + targetPage + '"]')) && (activePage.classList.toggle("navigation-wizard__page_active", !1), targetPage.classList.toggle("navigation-wizard__page_active", !0))
        }

        function goToNextPage(e) {
            e.preventDefault(), switchPage(1)
        }

        function goToPreviousPage(e) {
            e.preventDefault(), switchPage(-1)
        }
        var root = document.getElementById(prevPageButtons.id),
            nextPageButtons = root.querySelectorAll(".navigation-wizard__next-page-button"),
            prevPageButtons = root.querySelectorAll(".navigation-wizard__previous-page-button");
        _.each(nextPageButtons, function(e) {
            e.addEventListener("click", goToNextPage)
        }), _.each(prevPageButtons, function(e) {
            e.addEventListener("click", goToPreviousPage)
        })
    }
});
define("SubmitCancel/SubmitCancel", function() {
    "use strict";
    return function(model) {
        document.querySelector("#" + model.submitId).addEventListener("click", function(e) {
            return e.preventDefault(), e.stopPropagation(), !this.getAttribute("disabled") && void document.querySelector("#" + model.formId).submit()
        })
    }
});
define("TimeBox/TimeBox", ["controls/timebox"], function(TimeBox) {
    "use strict";
    return function(model) {
        new TimeBox({
            id: model.clientId
        })
    }
});
define("RecommendationItem/RecommendationItem", ["utils/domready"], function(domready) {
    "use strict";
    return function(model) {
        domready(function() {
            var area = document.getElementById(model.generatedId),
                confirmationButtonYes = area.querySelector(".button_background-edit"),
                deleteButton = area.querySelector(".button_background-delete"),
                confirmation = area.querySelector(".confirmation-box"),
                confirmations = document.querySelectorAll(".confirmation-box"),
                adminButtons = [confirmationButtonYes, deleteButton],
                confirmationButtonYes = confirmation.querySelector(".button_continue"),
                hideElements = function(elements) {
                    elements.forEach(function(element) {
                        null != element && element.classList.add("button_hide")
                    })
                },
                showElements = function(elements) {
                    elements.forEach(function(element) {
                        null != element && element.classList.remove("button_hide")
                    })
                },
                isAnyConfirmationActive = function() {
                    return [].some.call(confirmations, function(confirmation) {
                        return !confirmation.classList.contains("confirmation-box_disable")
                    })
                };
            confirmationButtonYes && confirmationButtonYes.addEventListener("click", function() {
                $.ajax({
                    type: "POST",
                    url: model.deleteLink,
                    dataType: "json",
                    success: function(data) {
                        data.error || window.location.reload(!0)
                    }
                })
            }), model.editMode && (area.addEventListener("mouseenter", function() {
                (isAnyConfirmationActive() ? hideElements : showElements)(adminButtons)
            }), area.addEventListener("mouseleave", function() {
                isAnyConfirmationActive() || hideElements(adminButtons)
            }), deleteButton.addEventListener("click", function() {
                confirmation.classList.remove("confirmation-box_disable")
            }))
        })
    }
});
define("RecommendationEditForm/RecommendationEditForm", function() {
    "use strict";
    return function(model) {
        var ordernumberEmptyError = document.querySelector(".error-message_order-number-required"),
            socialIdEmptyError = document.querySelector(".error-message_socialid-required"),
            confirmationButtonYes = document.querySelector(".error-message_socialid-invalid"),
            submitButton = document.querySelector(".button_submit"),
            viewButton = document.querySelector(".button_background-preview"),
            viewArea = document.querySelector(".recommendation-edit-form__preview-area"),
            submitButtons = [submitButton, viewButton],
            errors = [ordernumberEmptyError, socialIdEmptyError, confirmationButtonYes],
            socialIdInput = document.querySelector(".input_socialid"),
            ordernumberInput = document.querySelector(".input_ordernumber"),
            confirmationButtonYes = document.querySelector(".button_continue"),
            hideErrorMessages = function(errorMessages) {
                errorMessages.forEach(function(message) {
                    null != message && message.classList.remove("error-message_active")
                })
            },
            showErrorMessages = function(errorMessages) {
                errorMessages.forEach(function(message) {
                    message.classList.add("error-message_active")
                })
            },
            disableElements = function(elements) {
                elements.forEach(function(elem) {
                    elem.setAttribute("disabled", "disabled")
                })
            },
            enableElements = function(elements) {
                elements.forEach(function(elem) {
                    elem.removeAttribute("disabled")
                })
            },
            hidePreview = function() {
                null != viewArea && viewArea.classList.add("recommendation-edit-form__preview-area_disable")
            },
            isNotEmptyOrNull = function(value) {
                value = value.value.trim();
                return 0 !== value.length && "0" !== value
            },
            isFormFilled = function() {
                return [socialIdInput, ordernumberInput].every(isNotEmptyOrNull)
            },
            validateInput = function(input, errorMessages) {
                return !!isNotEmptyOrNull(input) || (showErrorMessages(input), !1)
            },
            validateNumber = function() {
                if (!validateInput(ordernumberInput)) return !1;
                var val = ordernumberInput.value;
                return !(!isFinite(val) || val <= 0 || 6 < val)
            },
            validateId = function() {
                return !!validateInput(socialIdInput) && !!isFinite(socialIdInput.value)
            },
            validateForm = function() {
                var isNumberValid = validateNumber(),
                    isFormValid = validateId(),
                    isFormValid = isNumberValid && isFormValid;
                return (isFormValid ? enableElements : disableElements)(submitButtons), isFormValid
            };
        socialIdInput.addEventListener("input", function() {
            hidePreview(), hideErrorMessages(errors), isFormFilled() && validateId() ? validateForm() : disableElements(submitButtons)
        }), ordernumberInput.addEventListener("input", function() {
            hideErrorMessages(errors), isFormFilled() ? validateForm() : disableElements(submitButtons)
        }), viewButton.addEventListener("click", function() {
            document.getElementsByName("IsPreview")[0].value = "True"
        }), submitButton.addEventListener("click", function() {
            document.getElementsByName("IsPreview")[0].value = "False"
        }), confirmationButtonYes && confirmationButtonYes.addEventListener("click", function() {
            document.getElementsByName("NeedReorder")[0].value = "true"
        }), validateForm()
    }
});
define("ProactiveClaimProvideService/ProactiveClaimProvideService", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        var dialogs = dnevnik.dialogs,
            root = document.getElementById(model.id),
            confirmButton = root.querySelector(".proactive-claim-provide-service__confirm"),
            preloader = (root.querySelector("form"), root.querySelector(".preloader"));
        confirmButton.addEventListener("click", function() {
            confirmButton.classList.add("proactive-claim-provide-service__hidden-element"), preloader.classList.remove("proactive-claim-provide-service__hidden-element"), $.ajax({
                type: "POST",
                url: model.provideServiceUrl,
                dataType: "json",
                processData: !1,
                contentType: !1,
                success: function(data) {
                    data.success ? (dialogs.message(model.message), window.location.replace(data.redirectUrl)) : dialogs.error(data.error)
                },
                complete: function() {
                    confirmButton.classList.remove("proactive-claim-provide-service__hidden-element"), preloader.classList.add("proactive-claim-provide-service__hidden-element")
                }
            })
        })
    }
});
define("ProactiveClaimRefuse/ProactiveClaimRefuse", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        var dialogs = dnevnik.dialogs,
            root = document.getElementById(model.id),
            selectBlock = root.querySelector(".universal-select"),
            confirmButton = root.querySelector(".proactive-claim-refuse__confirm"),
            preloader = (root.querySelector("form"), root.querySelector(".preloader"));
        confirmButton.addEventListener("click", function() {
            var conclusionReasonValue = selectBlock.getSelectValue();
            conclusionReasonValue ? (confirmButton.classList.add("proactive-claim-refuse__hidden-element"), preloader.classList.remove("proactive-claim-refuse__hidden-element"), $.ajax({
                type: "POST",
                url: model.refuseUrl + "?conclusionReason=" + conclusionReasonValue,
                processData: !1,
                contentType: !1,
                success: function(data) {
                    data.success ? (dialogs.message(model.message), window.location.replace(data.redirectUrl)) : (dialogs.error(data.error), confirmButton.removeAttribute("disabled"))
                },
                error: function() {
                    confirmButton.removeAttribute("disabled")
                },
                complete: function() {
                    confirmButton.classList.remove("proactive-claim-refuse__hidden-element"), preloader.classList.add("proactive-claim-refuse__hidden-element")
                }
            })) : dialogs.error(model.needConclusionReasonMessage)
        })
    }
});
define("RpguClaimProvideService/RpguClaimProvideService", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        var dialogs = dnevnik.dialogs,
            root = document.getElementById(model.id),
            uploader = root.querySelector(".rpgu-claim-provide-service__file-upload-input"),
            fileNameContainer = root.querySelector(".rpgu-claim-provide-service__file-name"),
            confirmButton = root.querySelector(".rpgu-claim-provide-service__confirm"),
            form = root.querySelector("form"),
            preloader = root.querySelector(".preloader"),
            fileApi = !!(window.File && window.FileReader && window.FileList && window.Blob);
        uploader.addEventListener("change", function() {
            var fileName = "";
            if (fileApi && uploader.files[0]) {
                if (uploader.files[0].size > model.maxFileSize) return uploader.value = "", fileNameContainer.textContent = model.downloadFileTitle, void dialogs.error(model.largeFileErrorMessage);
                fileName = uploader.files[0].name
            } else fileApi && 0 === uploader.files.length ? fileNameContainer.textContent = model.downloadFileTitle : dialogs.error(model.fileUploadErrorMessage);
            fileName.length && (fileNameContainer.textContent = fileName)
        });
        confirmButton.addEventListener("click", function() {
            !fileApi || uploader.files[0] ? (confirmButton.classList.add("rpgu-claim-provide-service__hidden-element"), preloader.classList.remove("rpgu-claim-provide-service__hidden-element"), $.ajax({
                type: "POST",
                url: model.provideServiceUrl,
                dataType: "json",
                data: new FormData(form),
                processData: !1,
                contentType: !1,
                success: function(data) {
                    data.success ? (dialogs.message(model.message), window.location.replace(data.redirectUrl)) : dialogs.error(data.error || model.fileUploadErrorMessage)
                },
                error: function() {
                    dialogs.error(model.fileUploadErrorMessage)
                },
                complete: function() {
                    confirmButton.classList.remove("rpgu-claim-provide-service__hidden-element"), preloader.classList.add("rpgu-claim-provide-service__hidden-element")
                }
            })) : dialogs.error(model.needFileMessage)
        })
    }
});
define("RpguClaimRefuse/RpguClaimRefuse", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        var dialogs = dnevnik.dialogs,
            root = document.getElementById(model.id),
            additionalInformationSelectId = model.conclusionReasonSelectId,
            conclusionReasonSelect = document.getElementById(additionalInformationSelectId),
            additionalInformationSelectId = model.additionalInformationSelectId,
            additionalInformationSelect = document.getElementById(additionalInformationSelectId),
            uploader = root.querySelector(".rpgu-claim-refuse__file-upload-input"),
            fileNameContainer = root.querySelector(".rpgu-claim-refuse__file-name"),
            iconExport = root.querySelector(".rpgu-claim-refuse__export-icon"),
            buttonExport = root.querySelector(".rpgu-claim-refuse__export-button-link"),
            confirmButton = root.querySelector(".rpgu-claim-refuse__confirm"),
            preloader = (root.querySelector("form"), root.querySelector(".preloader"));
        root.querySelector(".input_comment-validation");
        additionalInformationSelect.hideOptionsExceptValues(null);
        var fileApi = !!(window.File && window.FileReader && window.FileList && window.Blob);
        uploader.addEventListener("change", function() {
            var fileName = "";
            if (fileApi && uploader.files[0]) {
                if (uploader.files[0].size > model.maxFileSize) return uploader.value = "", fileNameContainer.textContent = model.downloadFileTitle, void dialogs.error(model.largeFileErrorMessage);
                fileName = uploader.files[0].name
            } else fileApi && 0 === uploader.files.length ? fileNameContainer.textContent = model.downloadFileTitle : dialogs.error(model.fileUploadErrorMessage);
            fileName.length && (fileNameContainer.textContent = fileName)
        }), conclusionReasonSelect.change = function(option, selectedValue) {
            var additionalInfoToShow;
            selectedValue && (additionalInfoToShow = selectedValue.charAt(0).toLowerCase() + selectedValue.slice(1), additionalInfoToShow = model.сonclusionReasonToAdditionalInfoRelations[additionalInfoToShow], additionalInformationSelect.hideOptionsExceptValues(additionalInfoToShow), null != additionalInfoToShow && 1 === additionalInfoToShow.length ? additionalInformationSelect.selectOptionByValue(additionalInfoToShow[0]) : additionalInformationSelect.dropToDefault(), iconExport.classList.toggle("rpgu-claim-refuse__export-icon_disable", !1), buttonExport.classList.toggle("rpgu-claim-refuse__export-button-link_disable", !1), buttonExport.href = model.exportUrl + "&conclusionReason=" + selectedValue)
        };
        confirmButton.addEventListener("click", function() {
            var data = [],
                conclusionReasonValue = conclusionReasonSelect.getSelectValue();
            conclusionReasonValue || data.push(model.needConclusionReasonMessage), fileApi && !uploader.files[0] && data.push(model.needFileMessage);
            var additionalInformationValue = additionalInformationSelect.getSelectValue();
            additionalInformationValue || data.push(model.needAdditionalInfoMessage), 0 < data.length ? dialogs.error(data.join("<br/>")) : (confirmButton.classList.add("rpgu-claim-refuse__hidden-element"), preloader.classList.remove("rpgu-claim-refuse__hidden-element"), (data = new FormData).append("file", uploader.files[0]), data.append("additionalComment", encodeURIComponent(additionalInformationValue)), $.ajax({
                type: "POST",
                url: model.refuseUrl + "?conclusionReason=" + conclusionReasonValue,
                data: data,
                processData: !1,
                contentType: !1,
                success: function(data) {
                    data.success ? (dialogs.message(model.message), window.location.replace(data.redirectUrl)) : (dialogs.error(data.error || model.fileUploadErrorMessage), confirmButton.removeAttribute("disabled"))
                },
                error: function() {
                    dialogs.error(model.fileUploadErrorMessage), confirmButton.removeAttribute("disabled")
                },
                complete: function() {
                    confirmButton.classList.remove("rpgu-claim-refuse__hidden-element"), preloader.classList.add("rpgu-claim-refuse__hidden-element")
                }
            }))
        })
    }
});
define("DeletionPopupContent/DeletionPopupContent", ["Popup/Popup"], function(Popup) {
    "use strict";
    return function(model) {
        var currentDecisionId;
        this.preparedDeletingDecision = function(button) {
            button = button.target;
            currentDecisionId = button.getAttribute("data-deleting-decision-id")
        };
        var currentPopup = new Popup({
                id: model.generatedId,
                canExit: !0,
                closeTriggerSelector: ".deletion-popup-content__buttons__cancel-button",
                isInnerCloseTrigger: !0,
                openTriggerSelector: ".decisions-list__delete-button",
                openTriggerAction: this.preparedDeletingDecision
            }),
            submitButton = currentPopup.getPopup().querySelector(".deletion-popup-content__buttons__submit-button");
        this.submitDecisionPopup = function(e) {
            e.preventDefault();
            var button = e.target;
            button.setAttribute("disabled", "disabled"), $.ajax({
                type: "Delete",
                url: model.submitUrl + "?decisionId=" + currentDecisionId,
                success: function() {
                    button.removeAttribute("disabled"), currentPopup.hidePopup(), document.location.href = model.successUrl
                },
                error: function(response) {
                    dnevnik.dialogs.error(response.responseJSON), button.removeAttribute("disabled")
                }
            })
        }, submitButton && submitButton.addEventListener("click", this.submitDecisionPopup)
    }
});
define("DecisionPopupContent/DecisionPopupContent", ["Popup/Popup", "dialogs/dialogs"], function(Popup) {
    "use strict";
    return function(model) {
        var currentDecisionId;
        this.preparedEditDecisionPopup = function(studentId) {
            var decision = studentId.target;
            currentDecisionId = decision.getAttribute("data-editing-decision-id");
            studentId = decision.getAttribute("data-student-id"), decision = model.decisions[studentId].find(function(d) {
                return d.id === currentDecisionId
            });
            currentPopupDlg.querySelector('.universal-select-list__item[data-value="' + studentId + '"]').dispatchEvent(new Event("mousedown")), currentPopupDlg.querySelector("input[name=DecisionNumber]").value = decision.decisionNumber, currentPopupDlg.querySelector("input[name=DecisionDate]").value = new Date(decision.decisionDate).toLocaleDateString(), currentPopupDlg.querySelector("textarea[name=DecisionText]").value = decision.decisionText
        };
        var currentPopupDlg, currentPopup = new Popup({
                id: model.generatedId,
                canExit: !0,
                closeTriggerSelector: ".decision-popup-content__buttons__cancel-button",
                isInnerCloseTrigger: !0,
                openTriggerSelector: model.isNewDecisionCreating ? ".decisions-tab-content__buttons-block__add-decision-button" : ".decisions-list__edit-button",
                openTriggerAction: model.isNewDecisionCreating ? null : this.preparedEditDecisionPopup
            }),
            submitButton = (currentPopupDlg = currentPopup.getPopup()).querySelector(".decision-popup-content__buttons__submit-button");
        this.submitDecisionPopup = function(e) {
            e.preventDefault();
            var button = e.target;
            button.setAttribute("disabled", "disabled"), $.ajax({
                type: "POST",
                url: model.submitUrl,
                dataType: "json",
                data: {
                    id: currentDecisionId,
                    groupId: model.groupId,
                    studentId: currentPopupDlg.querySelector(".universal-select-list__item_selected").getAttribute("data-value"),
                    decisionNumber: currentPopupDlg.querySelector("input[name=DecisionNumber]").value,
                    decisionDate: currentPopupDlg.querySelector("input[name=DecisionDate]").value,
                    decisionText: currentPopupDlg.querySelector("textarea[name=DecisionText]").value
                },
                success: function() {
                    button.removeAttribute("disabled"), currentPopup.hidePopup(), document.location.href = model.successUrl
                },
                error: function(response) {
                    dnevnik.dialogs.error(response.responseJSON), button.removeAttribute("disabled")
                }
            })
        }, submitButton && submitButton.addEventListener("click", this.submitDecisionPopup)
    }
});
define("AddNewParallel/AddNewParallel", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        var dialogs = dnevnik.dialogs,
            root = document.getElementById(model.id),
            sourceTemplateRow = root.querySelector(".add-new-parallel__source-parallel-row");
        root.querySelector("#" + model.cloneCheckboxId + ' input[type="checkbox"]').addEventListener("change", function() {
            sourceTemplateRow.classList.toggle("add-new-parallel__source-parallel-row_hidden", !this.checked)
        });
        var form = root.querySelector("form"),
            createButton = root.querySelector(".add-new-parallel__create");
        createButton.addEventListener("click", function() {
            createButton.setAttribute("disabled", "disabled"), $.ajax({
                type: "POST",
                url: model.addParallelUrl,
                dataType: "json",
                data: new FormData(form),
                processData: !1,
                contentType: !1,
                success: function(data) {
                    data.errors ? (dialogs.error(data.errors || model.tryAgainError), createButton.removeAttribute("disabled")) : window.location.replace(data.redirectUrl)
                },
                error: function() {
                    dialogs.error(model.tryAgainError), createButton.removeAttribute("disabled")
                }
            })
        })
    }
});
define("CopyParallel/CopyParallel", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        var dialogs = dnevnik.dialogs,
            root = document.getElementById(model.id),
            form = root.querySelector("form"),
            createButton = root.querySelector(".copy-parallel__create");
        createButton.addEventListener("click", function() {
            createButton.setAttribute("disabled", "disabled"), $.ajax({
                type: "POST",
                url: model.copyParallelUrl,
                dataType: "json",
                data: new FormData(form),
                processData: !1,
                contentType: !1,
                success: function(data) {
                    data.errors ? (dialogs.error(data.errors || model.tryAgainError), createButton.removeAttribute("disabled")) : window.location.replace(data.redirectUrl)
                },
                error: function() {
                    dialogs.error(model.tryAgainError), createButton.removeAttribute("disabled")
                }
            })
        })
    }
});
define("DeleteParallel/DeleteParallel", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        var dialogs = dnevnik.dialogs,
            deleteButton = document.getElementById(model.id).querySelector(".delete-parallel__delete");
        deleteButton.addEventListener("click", function() {
            deleteButton.setAttribute("disabled", "disabled"), $.ajax({
                type: "POST",
                url: model.deleteParallelUrl,
                dataType: "json",
                success: function(data) {
                    data.errors ? (dialogs.error(data.errors || model.tryAgainError), deleteButton.removeAttribute("disabled")) : window.location.replace(data.redirectUrl)
                },
                error: function() {
                    dialogs.error(model.tryAgainError), deleteButton.removeAttribute("disabled")
                }
            })
        })
    }
});
define("DeleteRubric/DeleteRubric", ["dialogs/dialogs"], function() {
    "use strict";
    return function(model) {
        var dialogs = dnevnik.dialogs,
            deleteButton = document.getElementById(model.id).querySelector(".delete-rubric__delete");
        deleteButton.addEventListener("click", function() {
            deleteButton.setAttribute("disabled", "disabled"), $.ajax({
                type: "POST",
                url: model.deleteRubricUrl,
                dataType: "json",
                success: function(data) {
                    data.errors ? (dialogs.error(data.errors || model.tryAgainError), deleteButton.removeAttribute("disabled")) : window.location.replace(data.redirectUrl)
                },
                error: function() {
                    dialogs.error(model.tryAgainError), deleteButton.removeAttribute("disabled")
                }
            })
        })
    }
});
define("TermReportTemplateNoteList/TermReportTemplateNoteList", ["Popup/Popup", "dialogs/dialogs"], function(Popup) {
    "use strict";
    var dialogs = dnevnik.dialogs;
    return function(model) {
        var root, noteList, editorTemplate, noteTemplate, deleteNotePopup, notes, addNoteContainer, addNoteButton, deleteNotePopupButton;

        function editNote(note, data) {
            note.querySelector(".term-report-template-note-list__category-mark").setAttribute("data-category", data.category), note.querySelector(".term-report-template-note-list__note-title span").textContent = data.title, note.querySelector(".term-report-template-note-list__note-text span").textContent = data.text
        }

        function openEditor(editorContainer, parameters, saveAction, onCloseEditorAction) {
            var editor = editorTemplate.cloneNode(!0),
                selectedCategory = parameters.category || model.defaultCategory,
                categorySelect = null;
            model.canChangeCategory && (categorySelect = function(editor, categoryItems) {
                var select = editor.querySelector(".term-report-template-note-list__category-select"),
                    selectPanel = select.querySelector(".term-report-template-note-list__category-select-panel"),
                    categoryMark = selectPanel.querySelector(".term-report-template-note-list__category-mark");
                categoryMark.setAttribute("data-category", categoryItems);
                var opened = !1;

                function switchList(state) {
                    select.classList.toggle("term-report-template-note-list__category-select_opened", state), opened = state
                }
                var categoryList = select.querySelector(".term-report-template-note-list__category-select-list"),
                    categoryItems = categoryList.querySelectorAll(".term-report-template-note-list__category-select-list-item");
                return _.forEach(categoryItems, function(item) {
                    item.addEventListener("click", function() {
                        var mark = item.querySelector(".term-report-template-note-list__category-mark");
                        categoryMark.setAttribute("data-category", mark.getAttribute("data-category")), switchList(!1)
                    })
                }), document.addEventListener("click", function(e) {
                    opened && !categoryList.contains(e.target) ? switchList(!1) : !opened && selectPanel.contains(e.target) && switchList(!0)
                }), {
                    getSelectedCategory: function() {
                        return categoryMark.getAttribute("data-category")
                    }
                }
            }(editor, selectedCategory));
            var titleInput = editor.querySelector('input[name="title"]'),
                textInput = editor.querySelector('input[name="text"]');
            titleInput.value = parameters.title || "", textInput.value = parameters.text || "";
            var saveButton = editor.querySelector(".term-report-template-note-list__editor-save");
            saveButton.addEventListener("click", function() {
                saveButton.setAttribute("disabled", "disabled");
                var parameters = {
                    category: categorySelect ? categorySelect.getSelectedCategory() : selectedCategory,
                    title: titleInput.value,
                    text: textInput.value
                };
                saveAction(parameters, function() {
                    editorContainer.innerHTML = "", onCloseEditorAction()
                }, function(err) {
                    dialogs.error(err), saveButton.removeAttribute("disabled")
                })
            }), editor.querySelector(".term-report-template-note-list__editor-cancel").addEventListener("click", function() {
                editorContainer.innerHTML = "", onCloseEditorAction()
            }), editorContainer.innerHTML = "", editorContainer.appendChild(editor), setTimeout(function() {
                titleInput.focus()
            }, 1)
        }

        function initializeNote(note) {
            var noteView = note.querySelector(".term-report-template-note-list__note-view"),
                editNoteContainer = note.querySelector(".term-report-template-note-list__note-edit");
            note.querySelector(".term-report-template-note-list__edit-note-button").addEventListener("click", function() {
                var parameters = {
                    category: note.querySelector(".term-report-template-note-list__category-mark").getAttribute("data-category"),
                    title: note.querySelector(".term-report-template-note-list__note-title span").textContent,
                    text: note.querySelector(".term-report-template-note-list__note-text span").textContent
                };
                openEditor(editNoteContainer, parameters, function(parameters, onSuccess, onError) {
                    parameters.noteId = note.getAttribute("data-note"),
                        function(note, parameters, onSuccess, onError) {
                            $.ajax({
                                type: "POST",
                                url: model.editNoteUrl,
                                dataType: "json",
                                data: parameters,
                                success: function(data) {
                                    data.errors ? onError(data.errors || model.tryAgainError) : (editNote(note, data), onSuccess())
                                },
                                error: function() {
                                    onError(model.tryAgainError)
                                }
                            })
                        }(note, parameters, onSuccess, onError)
                }, function() {
                    noteView.classList.toggle("term-report-template-note-list__note-view_hidden", !1), editNoteContainer.classList.toggle("term-report-template-note-list__note-edit_hidden", !0)
                }), noteView.classList.toggle("term-report-template-note-list__note-view_hidden", !0), editNoteContainer.classList.toggle("term-report-template-note-list__note-edit_hidden", !1)
            }), note.querySelector(".term-report-template-note-list__delete-note-button").addEventListener("click", function() {
                deleteNotePopup.getPopup().selectedNote = note, deleteNotePopup.showPopup()
            })
        }

        function addNoteAction(parameters, onSuccess, onError) {
            $.ajax({
                type: "POST",
                url: model.addNoteUrl,
                dataType: "json",
                data: parameters,
                success: function(data) {
                    data.errors ? onError(data.errors || model.tryAgainError) : (initializeNote(function(data) {
                        var note = noteTemplate.cloneNode(!0);
                        return note.setAttribute("data-note", data.id), editNote(note, data), noteList.appendChild(note), note
                    }(data)), onSuccess())
                },
                error: function() {
                    onError(model.tryAgainError)
                }
            })
        }
        model.canEdit && (root = document.getElementById(model.id), noteList = root.querySelector(".term-report-template-note-list__notes"), editorTemplate = root.querySelector(".term-report-template-note-list__templates .term-report-template-note-list__editor"), noteTemplate = root.querySelector(".term-report-template-note-list__templates .term-report-template-note-list__note"), deleteNotePopup = new Popup({
            id: model.deleteNotePopupId
        }), notes = noteList.querySelectorAll(".term-report-template-note-list__note"), _.forEach(notes, initializeNote), addNoteContainer = root.querySelector(".term-report-template-note-list__add-note-container"), (addNoteButton = root.querySelector(".term-report-template-note-list__add-note-button")).addEventListener("click", function() {
            openEditor(addNoteContainer, {}, addNoteAction, function() {
                addNoteButton.classList.toggle("term-report-template-note-list__add-note-button_hidden", !1), addNoteContainer.classList.toggle("term-report-template-note-list__add-note-container_hidden", !0)
            }), addNoteButton.classList.toggle("term-report-template-note-list__add-note-button_hidden", !0), addNoteContainer.classList.toggle("term-report-template-note-list__add-note-container_hidden", !1)
        }), (deleteNotePopupButton = root.querySelector(".term-report-template-note-list__delete-note-popup-delete-button")).addEventListener("click", function() {
            var noteId, onSuccess, onError, note = deleteNotePopup.getPopup().selectedNote;
            deleteNotePopupButton.setAttribute("disabled", "disabled"), noteId = note.getAttribute("data-note"), onSuccess = function() {
                ! function(note) {
                    note.parentNode.removeChild(note)
                }(note), deleteNotePopup.hidePopup(), deleteNotePopupButton.removeAttribute("disabled")
            }, onError = function(err) {
                dialogs.error(err), deleteNotePopupButton.removeAttribute("disabled")
            }, $.ajax({
                type: "POST",
                url: model.deleteNoteUrl,
                dataType: "json",
                data: {
                    noteId: noteId
                },
                success: function(data) {
                    data.errors ? onError(data.errors || model.tryAgainError) : onSuccess()
                },
                error: function() {
                    onError(model.tryAgainError)
                }
            })
        }))
    }
});
define("TermReportTemplate/TermReportTemplate", ["dialogs/dialogs"], function() {
    "use strict";
    var dialogs = dnevnik.dialogs;
    return function(model) {
        var root, addRubricButton, rubricEditor, titleInput, saveRubricButton;

        function switchEditor(isEdit) {
            addRubricButton.classList.toggle("term-report-template__new-rubric-button_hidden", isEdit), rubricEditor.classList.toggle("term-report-template__new-rubric-editor_hidden", !isEdit)
        }
        model.canEdit && (root = document.getElementById(model.id), addRubricButton = root.querySelector(".term-report-template__add-rubric-button"), rubricEditor = root.querySelector(".term-report-template__new-rubric-editor"), titleInput = root.querySelector(".term-report-template__new-rubric-title-input"), addRubricButton.addEventListener("click", function() {
            switchEditor(!(titleInput.value = ""))
        }), root.querySelector(".term-report-template__new-rubric-cancel").addEventListener("click", function() {
            return switchEditor(!1), !1
        }), (saveRubricButton = root.querySelector(".term-report-template__new-rubric-save")).addEventListener("click", function() {
            return saveRubricButton.setAttribute("disabled", "disabled"), $.ajax({
                type: "POST",
                url: model.addRubricUrl,
                dataType: "json",
                data: {
                    title: titleInput.value
                },
                success: function(data) {
                    data.errors ? (dialogs.error(data.errors || model.tryAgainError), saveRubricButton.removeAttribute("disabled")) : window.location.replace(model.templateUrl)
                },
                error: function() {
                    dialogs.error(model.tryAgainError), saveRubricButton.removeAttribute("disabled")
                }
            }), !1
        }))
    }
});
define("TermReportTemplateRubric/TermReportTemplateRubric", ["dialogs/dialogs"], function() {
    "use strict";
    var dialogs = dnevnik.dialogs;
    return function(model) {
        var root, rubricView, rubricEdit, title, titleInput, saveRubricButton;

        function switchEditor(isEdit) {
            rubricView.classList.toggle("term-report-template-rubric__view_hidden", isEdit), rubricEdit.classList.toggle("term-report-template-rubric__edit_hidden", !isEdit)
        }
        model.canEdit && (root = document.getElementById(model.id), rubricView = root.querySelector(".term-report-template-rubric__view"), rubricEdit = root.querySelector(".term-report-template-rubric__edit"), title = root.querySelector(".term-report-template-rubric__title"), titleInput = root.querySelector(".term-report-template-rubric__rubric-title-input"), root.querySelector(".term-report-template-rubric__edit-rubric-button").addEventListener("click", function() {
            titleInput.value = title.textContent, switchEditor(!0)
        }), root.querySelector(".term-report-template-rubric__editor-cancel").addEventListener("click", function() {
            return switchEditor(!1), !1
        }), (saveRubricButton = root.querySelector(".term-report-template-rubric__editor-save")).addEventListener("click", function() {
            return saveRubricButton.setAttribute("disabled", "disabled"), $.ajax({
                type: "POST",
                url: model.editRubricUrl,
                dataType: "json",
                data: {
                    title: titleInput.value
                },
                success: function(data) {
                    data.errors ? (dialogs.error(data.errors || model.tryAgainError), saveRubricButton.removeAttribute("disabled")) : (saveRubricButton.removeAttribute("disabled"), title.textContent = titleInput.value, switchEditor(!1))
                },
                error: function() {
                    dialogs.error(model.tryAgainError), saveRubricButton.removeAttribute("disabled")
                }
            }), !1
        }))
    }
});
define("DesktopHint/DesktopHint", function() {
    "use strict";
    return function(link) {
        function hideHint() {
            hintPopover.classList.remove("desktop-hint__popover_active"), hintQuestionmark.classList.remove("desktop-hint__questionmark_active")
        }
        var link = link.id,
            link = document.getElementById(link),
            hintQuestionmark = link.querySelector(".desktop-hint__questionmark"),
            hintPopover = link.querySelector(".desktop-hint__popover"),
            link = link.querySelector(".desktop-hint__link");
        link && link.addEventListener("mousedown", function(e) {
            e.preventDefault()
        }), hintPopover.addEventListener("blur", hideHint), hintQuestionmark.addEventListener("mousedown", function(e) {
            this.classList.contains("desktop-hint__questionmark_active") ? hideHint() : (hintPopover.classList.add("desktop-hint__popover_active"), hintQuestionmark.classList.add("desktop-hint__questionmark_active"), hintPopover.focus(), e.preventDefault())
        })
    }
});
define("SubjectsAndGroups/SubjectsAndGroups", function() {
    return function(model) {
        var sortBy, sortUrl = model.sortUrl,
            tbody = document.getElementsByClassName("objects-table")[0].getElementsByTagName("tbody")[0],
            header = document.getElementsByClassName("objects-header")[0],
            subjectHeader = header.getElementsByClassName("objects-header__cell_object")[0],
            groupHeader = header.getElementsByClassName("objects-header__cell_class")[0],
            lessonHeader = header.getElementsByClassName("objects-header__cell_next-lesson")[0],
            baseTemplate = _.template('<tr class="object-row"><td class="object-row__cell object-row__cell_object"><%= subject %></td><td class="object-row__cell object-row__cell_class"><%= group %><% if(hasSubgroup) { %><div class="objects-group">(<%= subgroup %>)</div> <% } %></td><td class="object-row__cell"><div class="object-row__link-wrapper"><a href="<%= journalUrl %>" target="_blank" class="object-row__link object-row__link_journal"></a></div></td><td class="object-row__cell"><div class="object-row__link-wrapper"><a href="<%= lessonsUrl %>" target="_blank" class="object-row__link object-row__link_lessons"></a></div></td><td class="object-row__cell"><div class="object-row__link-wrapper"><a href="<%= homeworksUrl %>" target="_blank" class="object-row__link object-row__link_homework"></a></div></td><td class="object-row__cell">'),
            lessonTemplate = _.template('<%  if (isFirst && hasMoreThanOneLesson && !isOpen) { %><div class="object-row__see-all" data-date="<%= date %>">...</div><% } %><a href="<%= url %>" target="_blank" class="object-row__link object-row__link_next-lesson<% if(isFirst && hasMoreThanOneLesson && !isOpen) { %> object-row__link_short<% } %><% if(!isFirst && hasMoreThanOneLesson) { %> object-row__link_in-list<% } %><% if(!isFirst && !isOpen) { %> object-row__link_hidden<% } %>"><span class="object-name"><span class="object-name__text"><%= title %></span></span><span class="object-date"><%= date %></span></a>'),
            sortAscTemplate = _.template('<span class="filter-name-wrapper filter-name-wrapper_up"><%= text %></span>'),
            sortDescTemplate = _.template('<span class="filter-name-wrapper filter-name-wrapper_down"><%= text %></span>'),
            endTemplate = "</td></tr>",
            sortStateKey = "dnevnik.ru:subjects_and_groups_sort_order",
            openedLessons = new Array;

        function clickHandler(e, sortBy, changeDirection) {
            sortBy = function(e, asc, desc) {
                return !hasDirection(e) || e.getElementsByTagName("span")[0].classList.contains("filter-name-wrapper_down") ? asc : desc
            }(e, sortBy, changeDirection), changeDirection = !0;
            hasDirection(e) || (clearSortDirections(), insertSortDirection(e, sortAscTemplate), changeDirection = !1), sortHandler(e, sortBy, changeDirection)
        }

        function fillTable(m) {
            for (var date, frag = document.createDocumentFragment(), i = 0; i < m.subjects.length; i++) {
                var result = "",
                    subject = m.subjects[i];
                result += baseTemplate(subject);
                for (var p = 0; p < subject.lessons.length; p++) {
                    var l = subject.lessons[p];
                    l.hasMoreThanOneLesson = subject.hasMoreThanOneLesson, l.isOpen = (date = l.date, _.includes(openedLessons, date)), result += lessonTemplate(l)
                }
                result += endTemplate;
                var e = document.createElement("tbody");
                e.innerHTML = result;
                for (var j = 0; j < e.childNodes.length; j++) {
                    var n = e.childNodes[j];
                    frag.appendChild(n)
                }
            }
            tbody.appendChild(frag),
                function() {
                    for (var dots = document.getElementsByClassName("object-row__see-all"), i = 0; i < dots.length; i++) {
                        dots[i].addEventListener("click", function(e) {
                            this.classList.add("object-row__see-all_hidden");
                            var n = this.nextSibling;
                            aNode = this.getAttribute("data-date"), openedLessons.push(aNode);
                            var aNode = this.parentNode.getElementsByClassName("object-row__link_short");
                            for (aNode && 0 < aNode.length && aNode[0].classList.remove("object-row__link_short"); n;) n.classList.contains("object-row__link_hidden") && n.classList.remove("object-row__link_hidden"), n = n.nextSibling
                        })
                    }
                }()
        }

        function hasDirection(e) {
            return !!e.getElementsByTagName("span")[0]
        }

        function clearSortDirections() {
            for (var headers = header.getElementsByTagName("th"), i = 0; i < headers.length; i++) {
                var text = headers[i].getElementsByClassName("filter-name-wrapper");
                0 < text.length && (text = text[0].innerHTML, headers[i].innerHTML = text)
            }
        }

        function insertSortDirection(e, html) {
            html = html({
                text: e.innerHTML
            });
            return e.innerHTML = html, e.childNodes[0]
        }

        function sortHandler(self, sortBy, changeDirection) {
            localStorage.setItem(sortStateKey, sortBy), post(sortBy, self.getElementsByTagName("span")[0], changeDirection)
        }

        function post(sortBy, e, needCangeDirection) {
            $.ajax({
                type: "POST",
                url: sortUrl,
                dataType: "json",
                data: {
                    sortBy: sortBy,
                    school: model.schoolId,
                    person: model.personId
                },
                success: function(data) {
                    ! function() {
                        for (var rows = tbody.getElementsByClassName("object-row"); 0 < rows.length;) rows[0].parentElement.removeChild(rows[0])
                    }(), fillTable(JSON.parse(data)), needCangeDirection && function(e) {
                        e.classList.contains("filter-name-wrapper_down") ? (e.classList.remove("filter-name-wrapper_down"), e.classList.add("filter-name-wrapper_up")) : (e.classList.add("filter-name-wrapper_down"), e.classList.remove("filter-name-wrapper_up"))
                    }(e)
                }
            })
        }(sortBy = localStorage.getItem(sortStateKey)) ? (clearSortDirections(), function(sortBy) {
            switch (sortBy) {
                case model.lessonsAsc:
                    insertSortDirection(lessonHeader, sortAscTemplate), sortHandler(lessonHeader, model.lessonsAsc, !1);
                    break;
                case model.lessonsDesc:
                    insertSortDirection(lessonHeader, sortDescTemplate), sortHandler(lessonHeader, model.lessonsDesc, !1);
                    break;
                case model.groupsAsc:
                    insertSortDirection(groupHeader, sortAscTemplate), sortHandler(groupHeader, model.groupsAsc, !1);
                    break;
                case model.groupsDesc:
                    insertSortDirection(groupHeader, sortDescTemplate), sortHandler(groupHeader, model.groupsDesc, !1);
                    break;
                case model.subjectsAsc:
                    insertSortDirection(subjectHeader, sortAscTemplate), sortHandler(subjectHeader, model.subjectsAsc, !1);
                    break;
                case model.subjectsDesc:
                    insertSortDirection(subjectHeader, sortDescTemplate), sortHandler(subjectHeader, model.subjectsDesc, !1);
                    break;
                default:
                    insertSortDirection(lessonHeader, sortAscTemplate), sortHandler(lessonHeader, model.lessonsAsc, !1)
            }
        }(sortBy)) : fillTable(model), lessonHeader.addEventListener("click", function(e) {
            clickHandler(this, model.lessonsAsc, model.lessonsDesc)
        }), subjectHeader.addEventListener("click", function(e) {
            clickHandler(this, model.subjectsAsc, model.subjectsDesc)
        }), groupHeader.addEventListener("click", function(e) {
            clickHandler(this, model.groupsAsc, model.groupsDesc)
        })
    }
});
define("LayoutDesktop/LayoutDesktop", function() {
    return function() {
        var doc = document,
            menuItems = doc.getElementsByClassName("menu__item");
        _.each(menuItems, function(element) {
            element.addEventListener("mouseover", function() {
                var submenu = this.getElementsByClassName("submenu")[0],
                    activeSubmenu = doc.getElementsByClassName("submenu_active")[0];
                activeSubmenu && activeSubmenu.classList.remove("submenu_active"), submenu.classList.add("submenu_active")
            })
        })
    }
});
define("PlanDetails/PlanDetails", function() {
    "use strict";
    return function(error) {
        var form = document.getElementById(error.id),
            checkbox = form.querySelector('input[data-splittingCheckbox="true"]'),
            semester = form.querySelector('div[data-cellType="semester"]'),
            year = form.querySelector('div[data-cellType="year"]');

        function show(e) {
            e.classList.remove("plan-details__row_hidden")
        }

        function hide(e) {
            e.classList.add("plan-details__row_hidden")
        }

        function updateSelectors() {
            checkbox.checked ? (show(semester), hide(year)) : (hide(semester), show(year))
        }
        updateSelectors(), checkbox.addEventListener("change", updateSelectors);
        error = form.querySelector(".error-message_active");
        error && (saveButton = error.getBoundingClientRect().top + window.pageYOffset - window.innerHeight / 2, window.scrollTo(0, saveButton));
        var saveButton = form.querySelector('button[type="submit"]');
        saveButton && saveButton.addEventListener("click", function(e) {
            e.preventDefault(), e.target.setAttribute("disabled", "disabled"), form.submit()
        })
    }
});
define("ModuleComponents/ModuleComponents", ["Popup/Popup"], function(Popup) {
    "use strict";
    return function(model) {
        for (var deletingPracticeId, componentDiv = document.querySelector('div[data-block="' + model.moduleId + '"][data-item-type="' + model.itemType + '"]'), componentList = componentDiv.querySelector(".module-components__list"), componentCaption = componentDiv.querySelector(".module-components__label"), addButton = componentDiv.querySelector(".button_add-practice"), deleteButtons = componentDiv.querySelectorAll(".button_delete-plan-button"), deletingPopupDlg = new Popup({
                id: "deleteItemPopup"
            }), deletingPopup = deletingPopupDlg.getPopup(), deletingPopupTextEl = deletingPopup.querySelector(".popup-deleting__caption"), editPopupDlg = new Popup({
                id: model.editPopupId
            }), updateCaption = function(newCaption) {
                componentCaption.innerText = newCaption
            }, deletePractice = function() {
                $.ajax({
                    type: "POST",
                    url: model.deletePracticeUrl,
                    dataType: "json",
                    data: {
                        practiceId: deletingPracticeId,
                        itemType: model.itemType
                    },
                    async: !0,
                    success: function(data) {
                        data.isError || (componentList.removeChild(componentList.querySelector('div[data-component="' + deletingPracticeId + '"]')), updateCaption(data.newCaption), deletingPopupDlg.hidePopup(!1), editPopupDlg.showPopup())
                    },
                    error: function(data) {
                        403 === data.status && location.reload()
                    }
                })
            }, applyDeleteEvent = function(practiceNameInput) {
                practiceNameInput.preventDefault();
                practiceNameInput = practiceNameInput.target;
                deletingPracticeId = practiceNameInput.getAttribute("data-component"), deletingPopup.onItemDelete = deletePractice, deletingPopup.onCancel = function() {
                    editPopupDlg.showPopup()
                };
                practiceNameInput = practiceNameInput.parentElement.querySelector(".module-components__index-input");
                deletingPopupTextEl.innerText = model.deleteComponentQuestion.replace("{0}", practiceNameInput.getAttribute("data-component-index")).replace("{1}", practiceNameInput.value), deletingPopupDlg.showPopup(), editPopupDlg.hidePopup(!1)
            }, i = 0; i < deleteButtons.length; i++) deleteButtons[i].addEventListener("click", function(e) {
            applyDeleteEvent(e)
        });
        addButton.addEventListener("click", function(e) {
            e.preventDefault(), $.ajax({
                type: "POST",
                url: model.addPracticeUrl,
                dataType: "json",
                data: {
                    moduleId: model.moduleId,
                    itemType: model.itemType
                },
                async: !0,
                success: function(data) {
                    data.isError || (function(practiceId, deleteBtn, practiceIndex) {
                        var itemDiv = document.createElement("div");
                        itemDiv.setAttribute("data-component", practiceId);
                        var colDiv = document.createElement("div");
                        colDiv.classList.add("module-components__col");
                        var input = document.createElement("input");
                        input.classList.add("module-components__index-input"), input.classList.add("small-input"), input.classList.add("small-input_full-width"), input.setAttribute("data-component", practiceId), input.setAttribute("type", "text"), input.setAttribute("maxlength", 200), input.setAttribute("data-component-index", practiceIndex), input.value = deleteBtn;
                        deleteBtn = document.createElement("a");
                        deleteBtn.classList.add("button"), deleteBtn.classList.add("button_height-with-gradient"), deleteBtn.classList.add("button_height-grey"), deleteBtn.classList.add("button_square-middle-height"), deleteBtn.classList.add("button_right"), deleteBtn.classList.add("button_margin-left-5"), deleteBtn.classList.add("button_trash-can-icon"), deleteBtn.classList.add("button_delete-plan-button"), deleteBtn.classList.add("button_borderless"), deleteBtn.setAttribute("onclick", "return false;"), deleteBtn.setAttribute("data-component", practiceId), deleteBtn.addEventListener("click", function(e) {
                            applyDeleteEvent(e)
                        }), colDiv.appendChild(input), itemDiv.appendChild(colDiv), itemDiv.appendChild(deleteBtn), componentList.appendChild(itemDiv)
                    }(data.practiceId, data.practiceName, data.practiceIndex), updateCaption(data.newCaption))
                },
                error: function(data) {
                    403 === data.status && location.reload()
                }
            })
        })
    }
});
define("PlanSubjectsBlocks/PlanSubjectsBlocks", ["Popup/Popup", "dragndrop/dragndrop"], function(Popup, dragndrop) {
    "use strict";
    return function() {
        for (var editLinks = document.querySelectorAll(".plan-subjects-blocks__edit-link"), editSubjectsButtons = document.querySelectorAll(".plan-subjects-blocks__edit-subjects"), createModuleButton = document.querySelector(".plan-subjects-blocks__create-module"), showEditSubjectsPopup = function(editSubjectsPopupDlg) {
                editSubjectsPopupDlg.preventDefault();
                var button = editSubjectsPopupDlg.target,
                    editSubjectsPopupDlg = new Popup({
                        id: button.getAttribute("data-open-popup-id")
                    });
                editSubjectsPopupDlg.getPopup().onItemClosed = function(subjectList) {
                    var subjectListEl;
                    subjectList && (function(subjectListEl, subjectList) {
                        for (; subjectListEl.firstChild;) subjectListEl.removeChild(subjectListEl.firstChild);
                        for (var j = 0; j < subjectList.length; j += 1) {
                            var subject = subjectList[j],
                                listItem = document.createElement("li");
                            listItem.setAttribute("data-order", subject.Order), listItem.classList.add("plan-subjects-list__item");
                            var code = document.createElement("div");
                            code.classList.add("plan-subjects-list__code"), code.innerText = subject.Caption;
                            var details = document.createElement("div");
                            details.classList.add("plan-subjects-list__details"), j === subjectList.length - 1 && details.classList.add("plan-subjects-list__details_last");
                            var icon = document.createElement("div");
                            icon.classList.add("plan-subjects-list__move-icon");
                            var name = document.createElement("div");
                            name.classList.add("plan-subjects-list__name"), name.innerText = subject.Name, details.appendChild(icon), details.appendChild(name), listItem.appendChild(code), listItem.appendChild(details), subjectListEl.appendChild(listItem)
                        }
                    }(subjectListEl = button.parentElement.querySelector(".plan-subjects-list"), subjectList), dragndrop.refresh(subjectListEl, "plan-subjects-list__item"))
                }, editSubjectsPopupDlg.showPopup()
            }, i = 0; i < editLinks.length; i++) editLinks[i].addEventListener("click", function(e) {
            ! function(editNamePopupDlg) {
                editNamePopupDlg.preventDefault();
                var link = editNamePopupDlg.target,
                    editNamePopupDlg = new Popup({
                        id: link.getAttribute("data-open-popup-id")
                    });
                editNamePopupDlg.getPopup().onItemClosed = function(newBlockCaption, newListCaptions) {
                    var captionEl, blockItems;
                    newBlockCaption && (captionEl = link.parentElement.querySelector(".plan-subjects-blocks__item__caption"), blockItems = link.parentElement.querySelectorAll(".plan-subjects-list__code"), captionEl.innerText = newBlockCaption, function(items, newCaptions) {
                        for (var i = 0; i < items.length; i += 1) {
                            items[i].innerText = newCaptions[i]
                        }
                    }(blockItems, newListCaptions))
                }, editNamePopupDlg.showPopup()
            }(e)
        });
        for (var j = 0; j < editSubjectsButtons.length; j++) editSubjectsButtons[j].addEventListener("click", function(e) {
            showEditSubjectsPopup(e)
        });
        createModuleButton && createModuleButton.addEventListener("click", function(e) {
            ! function(button) {
                button.preventDefault();
                button = button.target;
                new Popup({
                    id: button.getAttribute("data-open-popup-id")
                }).showPopup()
            }(e)
        })
    }
});
define("PlanSubjectsList/PlanSubjectsList", ["dragndrop/dragndrop", "Popup/Popup"], function(dragndrop, Popup) {
    "use strict";
    return function(model) {
        function deleteModule() {
            $.ajax({
                type: "POST",
                url: model.deleteModuleUrl,
                dataType: "json",
                data: {
                    moduleId: deletingModuleId
                },
                async: !0,
                success: function(data) {
                    data.isError || location.reload()
                },
                error: function(data) {
                    403 === data.status && location.reload()
                }
            })
        }
        var deletingModuleId, subjectsList = document.getElementById(model.id),
            editModuleLinks = subjectsList.querySelectorAll(".plan-subjects-list__link"),
            deleteModuleButtons = subjectsList.querySelectorAll(".button_module-delete"),
            deletingPopupDlg = new Popup({
                id: "deleteItemPopup"
            }),
            deletingPopup = deletingPopupDlg.getPopup(),
            deletingPopupTextEl = deletingPopup.querySelector(".popup-deleting__caption");
        dragndrop.init(subjectsList, "plan-subjects-list__item", "plan-subjects-list__item_grabbing", function(el1Details, el2Details) {
            el1Details = el1Details.querySelector(".plan-subjects-list__details"), el2Details = el2Details.querySelector(".plan-subjects-list__details");
            (el1Details.classList.contains("plan-subjects-list__details_last") || el2Details.classList.contains("plan-subjects-list__details_last")) && (el1Details.classList.toggle("plan-subjects-list__details_last"), el2Details.classList.toggle("plan-subjects-list__details_last"))
        }, function() {
            $.ajax({
                type: "POST",
                url: model.updateListUrl,
                dataType: "json",
                traditional: !0,
                data: {
                    planId: model.planId,
                    blockId: model.blockId,
                    orderList: function() {
                        for (var orderIds = [], i = 0; i < subjectsList.children.length; i += 1) {
                            var listItem = subjectsList.children[i];
                            listItem.classList.contains("plan-subjects-list__item") && orderIds.push(listItem.getAttribute("data-order"))
                        }
                        return orderIds
                    }()
                },
                async: !0,
                success: function(data) {
                    data.isError ? location.reload() : function(newCaptions) {
                        for (var order = 0, i = 0; i < subjectsList.children.length; i += 1) {
                            var listItem = subjectsList.children[i];
                            listItem.classList.contains("plan-subjects-list__item") && (listItem.setAttribute("data-order", order + 1), listItem.querySelector(".plan-subjects-list__code").innerText = newCaptions[order], order += 1)
                        }
                    }(data.newCaptions)
                },
                error: function(data) {
                    403 === data.status && location.reload()
                }
            })
        });
        for (var i = 0; i < editModuleLinks.length; i += 1) editModuleLinks[i].addEventListener("click", function(e) {
            ! function(createModulePopupDlg) {
                createModulePopupDlg.preventDefault();
                var link = createModulePopupDlg.target,
                    createModulePopupDlg = new Popup({
                        id: link.getAttribute("data-edit-popup-id")
                    });
                createModulePopupDlg.getPopup().onItemClosed = function(newModuleName) {
                    newModuleName && (link.parentElement.querySelector(".plan-subjects-list__name").innerText = newModuleName)
                }, createModulePopupDlg.showPopup()
            }(e)
        }), editModuleLinks[i].getAttribute("data-block") === model.createdModuleId && editModuleLinks[i].click();
        for (var j = 0; j < deleteModuleButtons.length; j += 1) deleteModuleButtons[j].addEventListener("click", function(e) {
            ! function(moduleNameInput) {
                moduleNameInput.preventDefault();
                var button = moduleNameInput.target;
                deletingModuleId = button.getAttribute("data-block"), deletingPopup.onItemDelete = deleteModule;
                var createModulePopupDlg = new Popup({
                    id: button.getAttribute("data-edit-popup-id")
                });
                createModulePopupDlg.hidePopup(!1);
                moduleNameInput = createModulePopupDlg.getPopup();
                button.classList.contains("button_module-list-item-delete") ? deletingPopup.onCancel = null : deletingPopup.onCancel = function() {
                    createModulePopupDlg.showPopup()
                };
                moduleNameInput = moduleNameInput.querySelector(".popup-module-create__name");
                deletingPopupTextEl.innerText = model.deleteModuleQuestion.replace("{0}", moduleNameInput.value), deletingPopupDlg.showPopup()
            }(e)
        })
    }
});
define("PopupChangeName/PopupChangeName", ["Popup/Popup"], function(Popup) {
    "use strict";
    return function(model) {
        function updateInput(input, isError) {
            var error = input.parentElement.querySelector(".error-message");
            isError ? (error.classList.add("error-message_active"), input.classList.add("small-input_error-red")) : (error.classList.remove("error-message_active"), input.classList.remove("small-input_error-red"))
        }
        var editNamePopupDlg = new Popup({
                id: model.popupId
            }),
            editNamePopup = editNamePopupDlg.getPopup(),
            closeButton = editNamePopup.querySelector(".button_height-grey"),
            saveButton = editNamePopup.querySelector(".button_height-green"),
            indexInput = editNamePopup.querySelector(".popup-change-name__index-input"),
            nameInput = editNamePopup.querySelector(".popup-change-name__name-input"),
            name = nameInput.value,
            index = indexInput.value;
        editNamePopup.onCancel = function() {
            indexInput.value = index, nameInput.value = name, updateInput(indexInput, !1), updateInput(nameInput, !1)
        }, closeButton.addEventListener("click", function() {
            editNamePopupDlg.hidePopup(!0)
        }), saveButton.addEventListener("click", function(e) {
            e.preventDefault(), $.ajax({
                type: "POST",
                url: model.saveUrl,
                dataType: "json",
                data: {
                    blockId: model.itemId,
                    index: indexInput.value,
                    name: nameInput.value
                },
                async: !0,
                success: function(data) {
                    data.isError ? (updateInput(indexInput, data.isIndexEmpty), updateInput(nameInput, data.isNameEmpty)) : (editNamePopupDlg.hidePopup(!1), name = nameInput.value, index = indexInput.value, editNamePopup.onItemClosed && editNamePopup.onItemClosed(data.newBlockCaption, data.newListCaptions))
                },
                error: function(data) {
                    403 === data.status && location.reload()
                }
            })
        })
    }
});
define("PopupEditSubjectsList/PopupEditSubjectsList", ["Popup/Popup"], function(Popup) {
    "use strict";
    return function(model) {
        function setCheckedSubjects() {
            checkedIds = [];
            for (var i = 0; i < checkboxes.length; i += 1) checkedIds.push(checkboxes[i].checked)
        }
        var checkedIds, editSubjectsPopupDlg = new Popup({
                id: model.popupId
            }),
            editSubjectsPopup = editSubjectsPopupDlg.getPopup(),
            closeButton = editSubjectsPopup.querySelector(".button_height-grey"),
            saveButton = editSubjectsPopup.querySelector(".button_height-green"),
            checkboxes = editSubjectsPopup.querySelectorAll(".blue-checkbox__input");
        setCheckedSubjects(), editSubjectsPopup.onCancel = function() {
            for (var i = 0; i < checkboxes.length; i += 1) checkboxes[i].checked = checkedIds[i]
        }, closeButton.addEventListener("click", function() {
            editSubjectsPopupDlg.hidePopup(!0)
        }), saveButton.addEventListener("click", function(e) {
            e.preventDefault(), $.ajax({
                type: "POST",
                url: model.saveUrl,
                dataType: "json",
                traditional: !0,
                data: {
                    blockId: model.itemId,
                    selectedSubjects: function() {
                        for (var subjectIds = [], i = 0; i < checkboxes.length; i += 1) {
                            var checkbox = checkboxes[i];
                            checkbox.checked && subjectIds.push(checkbox.getAttribute("data-subject-id"))
                        }
                        return subjectIds
                    }()
                },
                async: !0,
                success: function(data) {
                    data.isError || (setCheckedSubjects(), editSubjectsPopupDlg.hidePopup(!1), editSubjectsPopup.onItemClosed && editSubjectsPopup.onItemClosed(data.subjectList))
                },
                error: function(data) {
                    403 === data.status && location.reload()
                }
            })
        })
    }
});
define("SpecialtySelector/SpecialtySelector", ["dialogs/dialogs"], function() {
    "use strict";

    function localizeSelect(label, localization, eduLevel) {
        var loc = label.getSelectName(),
            label = function(select) {
                return document.querySelector("div[data-for=" + select.id + "] label")
            }(label);
        loc && label && ((loc = localization[loc + "." + eduLevel] || localization[loc]) && (label.innerHTML = loc))
    }

    function setSelectRowVisibility(select, show) {
        (function(select) {
            return document.querySelector("div[data-for=" + select.id + "]")
        })(select).classList.toggle("plan-details__row_hidden", !show)
    }
    return function(model) {
        function syncLevelValueChange(_, value) {
            localizeSelect(specialtyGroupSelect, model.localization, value), localizeSelect(specialtySelect, model.localization, value), setSelectRowVisibility(versionSelect, value !== model.pooEduLevel), setSelectRowVisibility(pooProgramTypeSelect, value === model.pooEduLevel)
        }
        var levelSelect = document.getElementById(model.levels.specialtyLevel),
            versionSelect = document.getElementById(model.levels.specialtyVersion),
            pooProgramTypeSelect = document.getElementById(model.levels.specialtyPooProgramType),
            categorySelect = document.getElementById(model.levels.specialtyCategory),
            specialtyGroupSelect = document.getElementById(model.levels.specialtyGroup),
            specialtySelect = document.getElementById(model.levels.specialty),
            qualificationSelect = document.getElementById(model.levels.specialtyQualification);
        syncLevelValueChange(0, levelSelect.getSelectValue());

        function updateSelectors(changedSelect, childSelects) {
            for (var i = childSelects.length - 1; 0 <= i; --i) setSelectRowVisibility(childSelects[i], !1), childSelects[i].toggleNativeInput(!1);
            changedSelect && changedSelect.getSelectValue() <= 0 || changedSelect === specialtySelect && levelSelect.getSelectValue() === model.pooEduLevel || $.ajax({
                type: "POST",
                url: model.getSpecialtiesUrl,
                dataType: "json",
                data: {
                    level: levelSelect.getSelectValue(),
                    version: versionSelect.getSelectValue(),
                    specialty: changedSelect && changedSelect.getSelectValue()
                },
                success: function(options) {
                    var select, childSelect = childSelects[0];
                    select = childSelect, options = options.specialties, select.update(options, 0), childSelect.toggleNativeInput(!0), setSelectRowVisibility(childSelect, !0)
                },
                error: function() {
                    dnevnik.dialogs.error(model.errorMessage)
                }
            })
        }
        levelSelect.change = function(_, value) {
            syncLevelValueChange(0, value), updateSelectors(null, [categorySelect, specialtyGroupSelect, specialtySelect, qualificationSelect])
        }, versionSelect.change = function() {
            updateSelectors(null, [categorySelect, specialtyGroupSelect, specialtySelect, qualificationSelect])
        }, categorySelect.change = function() {
            updateSelectors(categorySelect, [specialtyGroupSelect, specialtySelect, qualificationSelect])
        }, categorySelect.change = function() {
            updateSelectors(categorySelect, [specialtyGroupSelect, specialtySelect, qualificationSelect])
        }, specialtyGroupSelect.change = function() {
            updateSelectors(specialtyGroupSelect, [specialtySelect, qualificationSelect])
        }, specialtySelect.change = function() {
            updateSelectors(specialtySelect, [qualificationSelect])
        }
    }
});
define("PopupDeleting/PopupDeleting", ["Popup/Popup"], function(Popup) {
    "use strict";
    return function() {
        var deletingPopup = new Popup({
            id: "deleteItemPopup"
        }).getPopup();
        deletingPopup.querySelector(".button_accept-delete-item").addEventListener("click", function(e) {
            e.preventDefault(), deletingPopup.onItemDelete && deletingPopup.onItemDelete()
        })
    }
});
define("PopupModuleCreate/PopupModuleCreate", ["Popup/Popup", "common/synchronizer"], function(Popup, Synchronizer) {
    "use strict";
    return function(model) {
        function updateInput(input, isError) {
            var error = input.parentElement.querySelector(".error-message");
            isError ? (error.classList.add("error-message_active"), input.classList.add("small-input_error-red")) : (error.classList.remove("error-message_active"), input.classList.remove("small-input_error-red"))
        }

        function getInputValues(inputList) {
            var inputValues = [];
            if (inputList)
                for (var inputs = inputList.querySelectorAll(".module-components__index-input"), i = 0; i < inputs.length; i += 1) inputValues.push(inputs[i].value);
            return inputValues
        }
        var createModulePopupDlg = new Popup({
                id: model.createModulePopupId
            }),
            createModulePopup = createModulePopupDlg.getPopup(),
            closeButton = createModulePopup.querySelector(".button_module-create-cancel"),
            saveButton = createModulePopup.querySelector(".button_module-create-save"),
            nameInput = createModulePopup.querySelector(".popup-module-create__name"),
            name = nameInput.value;
        createModulePopup.onCancel = function() {
            nameInput.value = name, updateInput(nameInput, !1)
        }, closeButton.addEventListener("click", function() {
            createModulePopupDlg.hidePopup(!0)
        });

        function toggleButtonDisabledStyle(btn, enabled) {
            enabled ? btn.classList.remove("button_simple-disabled") : btn.classList.add("button_simple-disabled")
        }
        var saveSync = new Synchronizer;
        saveButton.addEventListener("click", function(e) {
            var studyPracticesList, manufactoringPracticesList;
            e.preventDefault(), saveSync.tryAcquire() && (toggleButtonDisabledStyle(e.target, !1), studyPracticesList = createModulePopup.querySelector('div[data-item-type="2"]'), manufactoringPracticesList = createModulePopup.querySelector('div[data-item-type="3"]'), $.ajax({
                type: "POST",
                url: model.saveUrl,
                dataType: "json",
                data: {
                    moduleId: model.blockId,
                    name: nameInput.value,
                    studyPlanId: model.planId,
                    studyPractices: getInputValues(studyPracticesList),
                    manufactoringPractices: getInputValues(manufactoringPracticesList)
                },
                async: !0,
                traditional: !0,
                success: function(data) {
                    data.isError ? (updateInput(nameInput, !0), toggleButtonDisabledStyle(e.target, !0), saveSync.release()) : model.blockId && "0" !== model.blockId ? (name = nameInput.value, updateInput(nameInput, !1), createModulePopupDlg.hidePopup(!1), createModulePopup.onItemClosed && createModulePopup.onItemClosed(name), toggleButtonDisabledStyle(e.target, !0), saveSync.release()) : location.reload()
                },
                error: function(data) {
                    403 === data.status ? location.reload() : (toggleButtonDisabledStyle(e.target, !0), saveSync.release())
                }
            }))
        })
    }
});
define("StudyPlan/StudyPlan", ["Popup/Popup"], function(Popup) {
    "use strict";
    return function(model) {
        function showMessage(messageText, title) {
            messageElement.innerText = messageText, popupMessage.setTitle(title), popupMessage.showPopup()
        }

        function updateStatus(status) {
            $.ajax({
                type: "POST",
                url: model.updateStatusUrl,
                dataType: "json",
                data: {
                    status: status
                },
                success: function(data) {
                    data.error ? showMessage(data.error, model.errorTitle) : window.location.replace(data.redirectUrl)
                },
                error: function() {
                    showMessage(model.tryAgain, model.errorTitle)
                }
            })
        }
        var popupMessage = new Popup({
                id: "popupMessage"
            }),
            messageElement = popupMessage.getPopup().querySelector(".popup-message__message"),
            publish = document.querySelector(".button_publish-study-plan"),
            setupDisableForm = document.querySelector(".button_unpublish-study-plan");
        publish && publish.addEventListener("click", function(e) {
            e.preventDefault(), updateStatus(!0)
        }), setupDisableForm && setupDisableForm.addEventListener("click", function(e) {
            e.preventDefault(), updateStatus(!1)
        }), model.message && showMessage(model.message.message, model.message.title);

        function disableForm(e) {
            e.target.querySelector('button[type="submit"]').setAttribute("disabled", "disabled")
        }
        setupDisableForm = function(form) {
            form = document.querySelector(form);
            form && form.addEventListener("submit", disableForm)
        };
        setupDisableForm(".popup-clone form"), setupDisableForm(".popup-delete-plan form")
    }
});
//# sourceMappingURL=blocks.js.map