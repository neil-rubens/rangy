import {ClassApplier, util, createClassApplier} from '../../lib/modules/rangy-classapplier';
import * as rangy from '../../lib/core';

QUnit.module("Class Applier module tests");

QUnit.test('Editable tests', (t) => {
    t.ok(ClassApplier.util);

    var testDiv = document.getElementById("qunit-fixture");
    testDiv.innerHTML = '<div>One<div contenteditable="true">Two<span contenteditable="false">three</span></div></div>';

    var container = testDiv.firstChild;
    t.notOk(util.isEditingHost(container));
    t.notOk(util.isEditableElement(container));
    t.notOk(util.isEditable(container));

    var nonEditableOuterText = container.firstChild;
    t.notOk(util.isEditingHost(nonEditableOuterText));
    t.notOk(util.isEditableElement(nonEditableOuterText));
    t.notOk(util.isEditable(nonEditableOuterText));

    var editableDiv = nonEditableOuterText.nextSibling;
    t.ok(util.isEditingHost(editableDiv));
    t.ok(util.isEditableElement(editableDiv));
    t.notOk(util.isEditable(editableDiv));

    var editableText = editableDiv.firstChild;
    t.notOk(util.isEditingHost(editableText));
    t.notOk(util.isEditableElement(editableText));
    t.ok(util.isEditable(editableText));

    var nonEditableSpan = editableText.nextSibling;
    t.notOk(util.isEditingHost(nonEditableSpan));
    t.notOk(util.isEditableElement(nonEditableSpan));
    t.notOk(util.isEditable(nonEditableSpan));

    var nonEditableText = nonEditableSpan.firstChild;
    t.notOk(util.isEditingHost(nonEditableText));
    t.notOk(util.isEditableElement(nonEditableText));
    t.notOk(util.isEditable(nonEditableText));
});

QUnit.test("isAppliedToRange tests", function(t) {
    var applier = createClassApplier("test");

    var testEl = document.getElementById("qunit-fixture");
    testEl.innerHTML = 'Test <span id="one" class="test">One</span> x <span id="two" class="test">Two <span id="three">Three</span> two</span> test';
    var oneEl = document.getElementById("one"), twoEl = document.getElementById("two"), threeEl = document.getElementById("three");
    var range = rangy.createRangyRange();

    range.selectNode(oneEl);
    t.ok(applier.isAppliedToRange(range));

    range.selectNodeContents(oneEl);
    t.ok(applier.isAppliedToRange(range));

    range.selectNode(twoEl);
    t.ok(applier.isAppliedToRange(range));

    range.selectNode(threeEl);
    t.ok(applier.isAppliedToRange(range));

    range.selectNode(testEl);
    t.notOk(applier.isAppliedToRange(range));

    range.selectNodeContents(testEl);
    t.notOk(applier.isAppliedToRange(range));

    range.setStart(testEl.firstChild, 4);
    range.setEndAfter(oneEl);
    t.notOk(applier.isAppliedToRange(range));

    range.setStart(testEl.firstChild, 5);
    t.ok(applier.isAppliedToRange(range));

    range.setEnd(oneEl.nextSibling, 0);
    t.ok(applier.isAppliedToRange(range));

    range.setEnd(oneEl.nextSibling, 1);
    t.notOk(applier.isAppliedToRange(range));
});

QUnit.test("toggleRange simple test 1", function(t) {
    var applier = createClassApplier("test", true);
    var testEl: any = document.getElementById("qunit-fixture");
    testEl.innerHTML = 'Test <span id="one" class="test">One</span> test';
    var oneEl = document.getElementById("one");
    var range = rangy.createRangyRange();
    range.selectNodeContents(oneEl);
    applier.toggleRange(range);

    t.equal(testEl.childNodes.length, 3);
    t.equal(testEl.firstChild.data, "Test ");
    t.equal(testEl.lastChild.data, " test");
    t.equal(testEl.childNodes[1].tagName, "SPAN");
    t.equal(testEl.childNodes[1].id, "one");
    t.equal(testEl.childNodes[1].className, "");
    t.equal(testEl.childNodes[1].childNodes.length, 1);
    t.equal(testEl.childNodes[1].firstChild.data, "One");

    applier.toggleRange(range);
    t.equal(testEl.childNodes.length, 3);
    t.equal(testEl.firstChild.data, "Test ");
    t.equal(testEl.lastChild.data, " test");
    t.equal(testEl.childNodes[1].tagName, "SPAN");
    t.equal(testEl.childNodes[1].id, "one");
    t.equal(testEl.childNodes[1].className, "test");
    t.equal(testEl.childNodes[1].childNodes.length, 1);
    t.equal(testEl.childNodes[1].firstChild.data, "One");
});

QUnit.test("toggleRange simple test 2", function(t) {
    var applier = createClassApplier("test", true);
    var testEl: any = document.getElementById("qunit-fixture");
    testEl.innerHTML = 'Test <span id="one" class="test other">One</span> test';
    var oneEl = document.getElementById("one");
    var range = rangy.createRangyRange();
    range.selectNodeContents(oneEl);
    applier.toggleRange(range);

    t.equal(testEl.childNodes.length, 3);
    t.equal(testEl.firstChild.data, "Test ");
    t.equal(testEl.lastChild.data, " test");
    t.equal(testEl.childNodes[1].tagName, "SPAN");
    t.equal(testEl.childNodes[1].id, "one");
    t.equal(testEl.childNodes[1].className, "other");
    t.equal(testEl.childNodes[1].childNodes.length, 1);
    t.equal(testEl.childNodes[1].firstChild.data, "One");

    applier.toggleRange(range);
    t.equal(testEl.childNodes.length, 3);
    t.equal(testEl.firstChild.data, "Test ");
    t.equal(testEl.lastChild.data, " test");
    t.equal(testEl.childNodes[1].tagName, "SPAN");
    t.equal(testEl.childNodes[1].id, "one");
    t.equal(testEl.childNodes[1].className, "other test");
    t.equal(testEl.childNodes[1].childNodes.length, 1);
    t.equal(testEl.childNodes[1].firstChild.data, "One");
});

QUnit.test("toggleRange nested in other class test", function(t) {
    var applier = createClassApplier("test", true);
    var testEl = document.getElementById("qunit-fixture");
    testEl.innerHTML = 'Before <span id="one" class="other">One</span> after';
    var oneEl: any = document.getElementById("one");
    var range = rangy.createRangyRange();
    range.setStart(oneEl.firstChild, 1);
    range.setEnd(oneEl.firstChild, 2);
    applier.toggleRange(range);

    t.equal(oneEl.childNodes.length, 3);
    t.equal(oneEl.className, "other");
    t.equal(oneEl.firstChild.data, "O");
    t.equal(oneEl.lastChild.data, "e");
    t.equal(oneEl.childNodes[1].tagName, "SPAN");
    t.equal(oneEl.childNodes[1].className, "test");
    t.equal(oneEl.childNodes[1].childNodes.length, 1);
    t.equal(oneEl.childNodes[1].firstChild.data, "n");

    //t.equal(testEl.innerHTML, 'Before <span id="one" class="other">O<span class="test">n</span>e</span> after');
});

QUnit.test("toggleRange range inside class test", function(t) {
    var applier = createClassApplier("test", true);
    var testEl = document.getElementById("qunit-fixture");
    testEl.innerHTML = 'Before <span id="one" class="test">One</span> after';
    var oneEl: any = document.getElementById("one");
    var range = rangy.createRangyRange();
    range.setStart(oneEl.firstChild, 1);
    range.setEnd(oneEl.firstChild, 2);
    applier.toggleRange(range);

    t.equal(oneEl.childNodes.length, 1);
    t.equal(oneEl.className, "test");
    t.equal(oneEl.firstChild.data, "O");
    //alert(testEl.innerHTML);
    t.equal(oneEl.nextSibling.data, "n");
    t.equal(oneEl.nextSibling.nextSibling.tagName, "SPAN");
    t.equal(oneEl.nextSibling.nextSibling.className, "test");
    t.equal(oneEl.nextSibling.nextSibling.childNodes.length, 1);
    t.equal(oneEl.nextSibling.nextSibling.firstChild.data, "e");

    //t.equal(testEl.innerHTML, 'Before <span id="one" class="test">O</span>n<span class="test">e</span> after');
});


function iterateNodes(node, func, includeSelf) {
    if (includeSelf) {
        func(node);
    }
    for (var i = 0, children = node.childNodes, len = children.length; i < len; ++i) {
        iterateNodes(children[i], func, true);
    }
}

class RangeInfo {
    sc: Node;
    so: number;
    ec: Node;
    eo: number;
    setStart(node, offset) {
        this.sc = node;
        this.so = offset;
    }
    setEnd(node, offset) {
        this.ec = node;
        this.eo = offset;
    }
}

function createRangeInHtml(containerEl: Element, html: string) {
    containerEl.innerHTML = html;
    var range = rangy.createRange(), foundStart = false;
    var rangeInfo = new RangeInfo();
    iterateNodes(containerEl, function(node) {
        if (node.nodeType == 3) {
            var openBracketIndex = node.data.indexOf("[");
            if (openBracketIndex != -1) {
                node.data = node.data.slice(0, openBracketIndex) + node.data.slice(openBracketIndex + 1);
                rangeInfo.setStart(node, openBracketIndex);
                foundStart = true;
            }

            var pipeIndex = node.data.indexOf("|");
            if (pipeIndex == 0) {
                node.data = node.data.slice(1);
                rangeInfo[foundStart ? "setEnd" : "setStart"](node.parentNode, rangy.dom.getNodeIndex(node));
                foundStart = true;
            } else if (pipeIndex == node.length - 1) {
                node.data = node.data.slice(0, -1);
                rangeInfo[foundStart ? "setEnd" : "setStart"](node.parentNode, rangy.dom.getNodeIndex(node) + 1);
                foundStart = true;
            }

            var closeBracketIndex = node.data.indexOf("]");
            if (closeBracketIndex != -1) {
                node.data = node.data.slice(0, closeBracketIndex) + node.data.slice(closeBracketIndex + 1);
                rangeInfo.setEnd(node, closeBracketIndex);
            }

            pipeIndex = node.data.indexOf("|");
            if (pipeIndex == 0) {
                node.data = node.data.slice(1);
                rangeInfo.setEnd(node.parentNode, rangy.dom.getNodeIndex(node));
            } else if (pipeIndex == node.length - 1) {
                node.data = node.data.slice(0, -1);
                rangeInfo.setEnd(node.parentNode, rangy.dom.getNodeIndex(node) + 1);
            }

            // Clear empty text node
            if (node.data.length == 0) {
                node.parentNode.removeChild(node);
            }
        }
    }, false);

    range.setStart(rangeInfo.sc, rangeInfo.so);
    range.setEnd(rangeInfo.ec, rangeInfo.eo);

    return range;
}

function getSortedClassName(el) {
    var classNameSupported = (typeof el.className == "string");
    var elClass = classNameSupported ? el.className : el.getAttribute("class");
    return elClass ? elClass.split(/\s+/).sort().join(" ") : "";
}

function canHaveChildren(el) {
    return !/^(area|base|basefont|br|col|frame|hr|img|input|isindex|link|meta|param)$/i.test(el.nodeName);
}

function htmlAndRangeToString(containerEl, range) {
    function isElementRangeBoundary(el, offset, range, isStart) {
        var prefix = isStart ? "start" : "end";
        return (el == range[prefix + "Container"] && offset == range[prefix + "Offset"]);
    }

    function getHtml(node, includeSelf) {
        var html = "", i, len, attr, children;
        if (node.nodeType == 1) {
            var nodeCanHaveChildren = canHaveChildren(node);
            if (includeSelf) {
                html = "<" + node.tagName.toLowerCase();
                if (node.id) {
                    html += ' id="' + node.id + '"';
                }
                var sortedClassName = getSortedClassName(node);
                if (sortedClassName) {
                    html += ' class="' + sortedClassName + '"';
                }
                if (node.href) {
                    html += ' href="' + node.href + '"';
                }
                for ( i = 0, len = node.attributes.length; i < len; ++i) {
                    attr = node.attributes[i];
                    if (!attr) { alert(i) }
                    if (attr.specified && !/^(id|href|class|style)$/.test(attr.name)) {
                        html += ' ' + attr.name + '="' + node.getAttribute(attr.name) + '"';
                    }
                }
                html += !nodeCanHaveChildren? " />" : ">";
            }

            for (i = 0, children = node.childNodes, len = children.length; i <= len; ++i) {
                if (isElementRangeBoundary(node, i, range, true)) {
                    html += "|";
                }
                if (isElementRangeBoundary(node, i, range, false)) {
                    html += "|";
                }
                if (i != len) {
                    html += getHtml(children[i], true);
                }
            }

            if (includeSelf && nodeCanHaveChildren) {
                html += "</" + node.tagName.toLowerCase() + ">";
            }
        } else if (includeSelf && node.nodeType == 3) {
            var text = node.data;
            if (node == range.endContainer) {
                text = text.slice(0, range.endOffset) + "]" + text.slice(range.endOffset);
            }
            if (node == range.startContainer) {
                text = text.slice(0, range.startOffset) + "[" + text.slice(range.startOffset);
            }

            html += text;
        }
        return html;
    }

    return getHtml(containerEl, false);
}

function testRangeHtml(testEl, html: string, t: Assert) {
    var range = createRangeInHtml(testEl, html);
    var newHtml = htmlAndRangeToString(testEl, range);
    t.equal(html, newHtml);
}


QUnit.test("Test the Range/HTML test functions", function(t) {
    var testEl = document.getElementById("qunit-fixture");
    testRangeHtml(testEl, 'Before <span class="test">[One]</span> after', t);
    testRangeHtml(testEl, 'Before <span class="test">|On]e</span> after', t);
    testRangeHtml(testEl, 'Before <span class="test">|One|</span> after', t);
    testRangeHtml(testEl, 'Bef[ore <span class="test">One</span> af]ter', t);
    testRangeHtml(testEl, 'Bef[ore <span class="test">|One</span> after', t);
    testRangeHtml(testEl, '1[2]3', t);
});

/*
See http://jsfiddle.net/QTs5U/
and http://aryeh.name/spec/editcommands/autoimplementation.html
 */


QUnit.test("Test unapply to range spanning two blocks", function(t) {
    var applier = createClassApplier("c1", true);

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '<p>[One</p><div class="key">Two]</div>');

    applier.applyToRange(range);
    t.equal('<p><span class="c1">[One</span></p><div class="key"><span class="c1">Two]</span></div>', htmlAndRangeToString(testEl, range));

    applier.undoToRange(range);
    t.equal('<p>[One</p><div class="key">Two]</div>', htmlAndRangeToString(testEl, range));
});

/*
    Has this test ever passed? I don't think it ever worked this way.

    QUnit.test("Test multiple classes", function(t) {
        var applier1 = createClassApplier("c1"),
            applier2 = createClassApplier("c2");

        var testEl = document.getElementById("qunit-fixture");
        var range = createRangeInHtml(testEl, "1[234]5");

        applier1.applyToRange(range);
        t.equal('1<span class="c1">[234]</span>5', htmlAndRangeToString(testEl, range));

        range.setStart(range.startContainer, range.startOffset + 1);
        range.setEnd(range.endContainer, range.endOffset - 1);
        applier2.applyToRange(range);
        t.equal('1<span class="c1">2</span><span class="c1 c2">[3]</span><span class="c1">4</span>5', htmlAndRangeToString(testEl, range));
    });
*/

QUnit.test("Test issue 50 (Mac double click)", function(t) {
    var applier = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, "<b>[one</b>] two");

    applier.applyToRange(range);
    t.equal('<b><span class="c1">[one]</span></b> two', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test issue 54 (two appliers, apply first then apply second to subrange then toggle first on same range)", function(t) {
    var applier1 = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'T<span class="c1">h<span class="c2">[r]</span>e</span>e');

    applier1.toggleRange(range);
    t.equal('T<span class="c1">h</span><span class="c2">[r]</span><span class="c1">e</span>e', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test issue 54 (two appliers, apply first then apply second to subrange then toggle first on same range, more nodes)", function(t) {
    var applier1 = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '<b>One</b> T<span class="c1">h<span class="c2">[r]</span>e</span>e');

    applier1.toggleRange(range);
    t.equal('<b>One</b> T<span class="c1">h</span><span class="c2">[r]</span><span class="c1">e</span>e', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test issue 54 related (last step toggles subrange of subrange)", function(t) {
    var applier1 = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'T<span class="c1">h<span class="c2">r[r]r</span>e</span>e');

    applier1.toggleRange(range);
    t.equal('T<span class="c1">h<span class="c2">r</span></span><span class="c2">[r]</span><span class="c1"><span class="c2">r</span>e</span>e', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test issue 57 (isAppliedToRange on empty range)", function(t) {
    var applier = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '<span class="c1">te[]st</span>');
    t.ok(applier.isAppliedToRange(range));

    range = createRangeInHtml(testEl, 'te[]st');
    t.notOk(applier.isAppliedToRange(range));
});

QUnit.test("Test issue 202 (undoToRanges)", function(t) {
    var applier = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    testEl.innerHTML = '1<span class="c1">2</span>';
    var range = rangy.createRange();
    range.setStartAndEnd(testEl.firstChild, 1, testEl, 2);
    applier.undoToRanges([range]);
    t.equal(testEl.innerHTML, '12');
});

QUnit.test("Test whitespace 1 (non-ignorable whitespace)", function(t) {
    var applier = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'x[<b>1</b> <i>2</i>]x');
    applier.applyToRange(range);
    t.equal('x<b><span class="c1">[1</span></b><span class="c1"> </span><i><span class="c1">2]</span></i>x', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test whitespace 2 (ignorable whitespace)", function(t) {
    var applier = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'x[<p>1</p> <p>2</p>]x');
    applier.applyToRange(range);
    t.equal('x<p><span class="c1">[1</span></p> <p><span class="c1">2]</span></p>x', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test whitespace 3 (ignorable whitespace, ignore option disabled)", function(t) {
    var applier = createClassApplier("c1", {ignoreWhiteSpace: false});

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'x[<p>1</p> <p>2</p>]x');
    applier.applyToRange(range);
    t.equal('x<p><span class="c1">[1</span></p><span class="c1"> </span><p><span class="c1">2]</span></p>x', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test whitespace 4 (pre whitespace between paras)", function(t) {
    var applier = createClassApplier("c1", {ignoreWhiteSpace: true});

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'x[<div style="white-space: pre"><p>1</p> <p>2</p></div>]x');
    applier.applyToRange(range);
    t.equal('x<div><p><span class="c1">[1</span></p><span class="c1"> </span><p><span class="c1">2]</span></p></div>x', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test whitespace 5 (normal whitespace between paras)", function(t) {
    var applier = createClassApplier("c1", {ignoreWhiteSpace: true});

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'x[<div style="white-space: normal"><p>1</p> <p>2</p></div>]x');
    applier.applyToRange(range);
    t.equal('x<div><p><span class="c1">[1</span></p> <p><span class="c1">2]</span></p></div>x', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test whitespace 6 (pre-line whitespace with no line break between paras)", function(t) {
    var applier = createClassApplier("c1", {ignoreWhiteSpace: true});

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'x[<div style="white-space: pre-line"><p>1</p> <p>2</p></div>]x');
    applier.applyToRange(range);
    t.equal('x<div><p><span class="c1">[1</span></p> <p><span class="c1">2]</span></p></div>x', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test whitespace 7 (pre-line whitespace with line break between paras)", function(t) {
    var applier = createClassApplier("c1", {ignoreWhiteSpace: true});

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'x[<div style="white-space: pre-line"><p>1</p>\n<p>2</p></div>]x');
    applier.applyToRange(range);
    t.equal('x<div><p><span class="c1">[1</span></p><span class="c1">\n</span><p><span class="c1">2]</span></p></div>x', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test link", function(t) {
    var applier = createClassApplier("c1", {
        elementTagName: "a",
        elementProperties: {
            "href": "http://www.google.com/"
        }
    });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 't[es]t');
    applier.applyToRange(range);
    t.equal('t<a class="c1" href="http://www.google.com/">[es]</a>t', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test removal of element with elementProperties", function(t) {
    var applier = createClassApplier("c1", {
        elementTagName: "a",
        elementProperties: {
            "href": "http://www.google.com/"
        }
    });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '[1<a class="c1" href="http://www.timdown.co.uk/">2</a><span class="c1">3</span><a class="c1" href="http://www.google.com/">4</a>]5');
    applier.undoToRange(range);
    t.equal('[1<a href="http://www.timdown.co.uk/">2</a><span class="c1">3</span>4]5', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test removal of element with elementAttributes", function(t) {
    var applier = createClassApplier("c1", {
        elementTagName: "a",
        elementAttributes: {
            "href": "http://www.google.com/"
        }
    });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '[1<a class="c1" href="http://www.timdown.co.uk/">2</a><span class="c1">3</span><a class="c1" href="http://www.google.com/">4</a>]5');
    applier.undoToRange(range);
    t.equal('[1<a href="http://www.timdown.co.uk/">2</a><span class="c1">3</span>4]5', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test removal of element with elementAttributes and relative URL href", function(t) {
    var applier = createClassApplier("c1", {
        elementTagName: "a",
        elementAttributes: {
            "href": "/test"
        }
    });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '[1<a class="c1" href="/test">2</a>3]4');
    applier.undoToRange(range);
    t.equal('[123]4', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test adding extra class", function(t) {
    var applier = createClassApplier("c1", {
        elementProperties: {
            "className": "extra"
        }
    });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 't[es]t');

    applier.toggleRange(range);
    t.equal('t<span class="c1 extra">[es]</span>t', htmlAndRangeToString(testEl, range));

    applier.toggleRange(range);
    t.equal('t[es]t', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test adding extra class with overlapping containers", function(t) {
    var applier = createClassApplier("c1", { elementProperties: { "className": "extra" } });
    var applier2 = createClassApplier("c2", { elementProperties: { "className": "extra" } });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 't[es]t');
    applier.applyToRange(range);
    applier2.applyToRange(range);
    t.equal('t<span class="c1 c2 extra">[es]</span>t', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test toggling extra class with overlapping containers", function(t) {
    var applier = createClassApplier("c1", { elementProperties: { "className": "extra" } });
    var applier2 = createClassApplier("c2", { elementProperties: { "className": "extra" } });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 't[es]t');
    applier.applyToRange(range);
    applier2.applyToRange(range);
    applier2.undoToRange(range);
    t.equal('t<span class="c1 extra">[es]</span>t', htmlAndRangeToString(testEl, range));

    applier.undoToRange(range);
    t.equal('t[es]t', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test range after two toggles", function(t) {
    var applier1 = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'o[n]e');

    applier1.toggleRange(range);
    t.equal('o<span class="c1">[n]</span>e', htmlAndRangeToString(testEl, range));

    var t1 = testEl.firstChild, t2 = testEl.lastChild;
    range.setStart(t1, 1);
    range.setEnd(t2, 0);
    t.equal('o[<span class="c1">n</span>]e', htmlAndRangeToString(testEl, range));

    applier1.toggleRange(range);
    t.equal('o[n]e', htmlAndRangeToString(testEl, range));
});

declare global {
    interface Assert {
        notThrows(f: () => void, msg?: string): void;
    }
}
QUnit.assert.notThrows = function(f: () => void, msg?: string) {
    let e;
    try {
        f()
    } catch (err) {
        e = err;
    }
    const result = typeof e === 'undefined';
    const desc = result || (typeof e.stack === 'undefined')? '' : e.stack;
    this.pushResult({
        result,
        message: msg + desc
    });
};

QUnit.test("Test issue 73 (range ending in element)", function(t) {
    var applier = createClassApplier("c1");

    var testEl = document.getElementById("qunit-fixture");
    testEl.innerHTML = '<span class="c1">one</span>two';
    var range = rangy.createRange();
    var span = testEl.childNodes[0];
    range.setStart(span.firstChild, 0);
    range.setEnd(testEl, 1);
    t.notThrows(() => applier.toggleRange(range));
    //t.equal('<span class="c1">[one]</span><br><br> two', htmlAndRangeToString(testEl, range));
});

QUnit.test("Test issue 101 (adding style properties)", function(t) {
    var applier = createClassApplier("c1", {
        elementTagName: "a",
        elementProperties: {
            href: "http://www.timdown.co.uk/",
            style: {
                "fontWeight": "bold"
            }
        }
    });

    var testEl = document.getElementById("qunit-fixture");
    testEl.innerHTML = "one";
    var range = rangy.createRange();
    range.selectNodeContents(testEl);
    applier.toggleRange(range);
    //alert(testEl.outerHTML)

    var link = testEl.firstChild as HTMLLinkElement;
    t.equal(link.nodeName.toLowerCase(), "a");
    t.equal(link.href.toLowerCase(), "http://www.timdown.co.uk/");
    t.equal(link.style.fontWeight, "bold");

    applier.toggleRange(range);
    t.equal(testEl.innerHTML, "one");
});

QUnit.test("Issue 111 (extra option for useExistingElements)", function(t) {
    var applier = createClassApplier("c1", {
        useExistingElements: true
    });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, 'x[1<span class="c2">2</span>3]x');
    applier.applyToRange(range);
    t.equal('x<span class="c1">[1</span><span class="c1 c2">2</span><span class="c1">3]</span>x', htmlAndRangeToString(testEl, range));
    applier.undoToRange(range);
    t.equal('x[1<span class="c2">2</span>3]x', htmlAndRangeToString(testEl, range));

    applier = createClassApplier("c1", {
        useExistingElements: false
    });

    applier.applyToRange(range);
    t.equal('x<span class="c1">[1</span><span class="c2"><span class="c1">2</span></span><span class="c1">3]</span>x', htmlAndRangeToString(testEl, range));
    applier.undoToRange(range);
    t.equal('x[1<span class="c2">2</span>3]x', htmlAndRangeToString(testEl, range));
});

QUnit.test("Issue 139 (Merge bug)", function(t) {
    var applier = createClassApplier("test");
    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '<div><span class="test">[1<span class="test"></span></span> 2]</div>');
    applier.applyToRange(range);
    t.equal('<div><span class="test">[1 2]</span></div>', htmlAndRangeToString(testEl, range));
});

QUnit.test("Undo to range with empty span with class", function(t) {
    var applier = createClassApplier("test");
    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '<div>[1<span class="test"><span class="test"></span></span>2]</div>');
    applier.undoToRange(range);
    t.equal('<div>[12]</div>', htmlAndRangeToString(testEl, range));
});

QUnit.test("Issue 148 (isAppliedToRange on range containing just an image)", function(t) {
    var applier = createClassApplier("test");
    var testEl = document.getElementById("qunit-fixture");

    var range = createRangeInHtml(testEl, 'one [] two');
    t.notOk(applier.isAppliedToRange(range));
    range = createRangeInHtml(testEl, 'one [<img src="fake.png">] two');
    t.notOk(applier.isAppliedToRange(range));

    range = createRangeInHtml(testEl, '<span class="test">one [] two</span>');
    t.ok(applier.isAppliedToRange(range));
    range = createRangeInHtml(testEl, '<span class="test">one [<img src="fake.png">] two</span>');
    t.ok(applier.isAppliedToRange(range));
});

QUnit.test("Apply elementAttributes", function(t) {
    var applier = createClassApplier("test", {
        elementAttributes: {
            "data-test": "foo"
        }
    });
    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '<div>1[2]3</div>');
    applier.applyToRange(range);
    t.equal('<div>1<span class="test" data-test="foo">[2]</span>3</div>', htmlAndRangeToString(testEl, range));
});

QUnit.test("Unapply simple", function(t) {
    var applier = createClassApplier("test");
    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '<div>1[<span class="test">2</span>]3</div>');
    applier.undoToRange(range);
    t.equal('<div>1[2]3</div>', htmlAndRangeToString(testEl, range));
});

QUnit.test("Unapply simple with any tag", function(t) {
    var applier = createClassApplier("test", {
        tagNames: ["*"]
    });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '<div>1[<span class="test">2</span>]3</div>');
    applier.undoToRange(range);
    t.equal('<div>1[2]3</div>', htmlAndRangeToString(testEl, range));
});

QUnit.test("Unapply elementAttributes", function(t) {
    var applier = createClassApplier("test", {
        elementAttributes: {
            "data-test": "foo"
        }
    });
    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '<div>1[<span class="test" data-test="foo">2</span>]3</div>');
    applier.undoToRange(range);
    t.equal('<div>1[2]3</div>', htmlAndRangeToString(testEl, range));
});

QUnit.skip("Merge error (issue 176)", function(t) {
    var applier = createClassApplier("one");
    var testEl = document.getElementById("qunit-fixture");
    testEl.innerHTML = '<span class="one"><span class="two"><span>a</span></span></span>b';
    var range = rangy.createRange();
    range.selectNode(testEl);
    applier.applyToRange(range);
    // t.equal('[<span class="one"><span class="two"><span>a</span></span></span>b]', htmlAndRangeToString(testEl, range));
});

QUnit.test("Apply with className element property (issue 177)", function(t) {
    var applier = createClassApplier("test", {
        elementProperties: {
            "className": "foo"
        }
    });
    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '[1]');
    applier.applyToRange(range);
    t.equal('<span class="foo test">[1]</span>', htmlAndRangeToString(testEl, range));
});

QUnit.test("onElementCreate test", function(t) {
    var elementDataTest;

    var applier = createClassApplier("test", {
        elementAttributes: {
            "data-test": "foo"
        },
        onElementCreate: function(el) {
            elementDataTest = el.getAttribute("data-test");
        }
    });

    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '[1]');
    applier.applyToRange(range);

    t.equal(elementDataTest, "foo");
});

QUnit.skip("removeEmptyContainers error (issue 188)", function(t) {
    var applier = createClassApplier("test");
    var testEl = document.getElementById("qunit-fixture");
    testEl.innerHTML = '<span class="test"></span>';
    var range = rangy.createRange();
    range.selectNodeContents(testEl);
    applier.applyToRange(range);
});

QUnit.test("removeEmptyContainers error undoToRange (issue 188)", function(t) {
    var applier = createClassApplier("test");
    var testEl = document.getElementById("qunit-fixture");
    testEl.innerHTML = '1<span class="test"></span><span class="test">2</span><span class="test"></span>3';
    var range = rangy.createRange();
    range.setStartAndEnd(testEl, 1, 4);
    applier.undoToRange(range);
    t.equal(testEl.innerHTML, "123");
    t.equal(testEl.childNodes.length, 1);
    t.equal(range.startContainer, testEl.firstChild);
    t.equal(range.startOffset, 1);
    t.equal(range.endContainer, testEl.firstChild);
    t.equal(range.endOffset, 2);
});

QUnit.test("Apply class to empty elements (issue 83)", function(t) {
    var applier = createClassApplier("test", {
        tagNames: ["span", "br"]
    });
    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '1[2<br>3]4');
    applier.applyToRange(range);
    t.equal('1<span class="test">[2</span><br class="test" /><span class="test">3]</span>4', htmlAndRangeToString(testEl, range));
});

QUnit.test("Unapply class to empty elements (issue 83)", function(t) {
    var applier = createClassApplier("test", {
        tagNames: ["span", "br"]
    });
    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '1[2<br class="test">3]4');
    applier.undoToRange(range);
    t.equal('1[2<br />3]4', htmlAndRangeToString(testEl, range));
});

QUnit.test("Avoid style, script and textarea elements (issue 281)", function(t) {
    var applier = createClassApplier("test");
    var testEl = document.getElementById("qunit-fixture");
    var range = createRangeInHtml(testEl, '1[2<style>.cheese { color: yellow; }</style>3]4');
    applier.applyToRange(range);
    t.equal('1<span class="test">[2</span><style>.cheese { color: yellow; }</style><span class="test">3]</span>4', htmlAndRangeToString(testEl, range));
});

if (document.createElementNS) {
    /*
            QUnit.test("Apply ignores non-HTML elements (issue #178)", function(t) {
                var applier = createClassApplier("test");
                var testEl = document.getElementById("qunit-fixture");
                var customElement = document.createElementNS('my:custom:ns', 'span');
                customElement.appendChild(document.createTextNode('b'));
                testEl.appendChild(customElement);
                var range = rangy.createRange();
                range.selectNode(testEl);
                applier.applyToRange(range);
                t.equal(testEl.childNodes.length, 1);
                t.equal(testEl.firstChild, customElement);
                t.equal(testEl.firstChild.childNodes.length, 1);
                // Some browsers don't put a valid innerHTML on custom namespaced elements
                if (rangy.util.isHostProperty(testEl.firstChild.firstChild, "outerHTML")) {
                    t.equal(testEl.firstChild.firstChild.outerHTML, '<span class="test">b</span>');
                }
            });

            QUnit.test("Unapply ignores non-HTML elements (issue #178)", function(t) {
                var applier = createClassApplier("test");
                var testEl = document.getElementById("qunit-fixture");
                var customElement = document.createElementNS('my:custom:ns', 'span');
                // Make the custom element look somewhat like a HTML element
                customElement.setAttribute("class", "test");
                customElement.appendChild(document.createTextNode('b'));
                testEl.appendChild(customElement);
                var range = rangy.createRange();
                range.selectNode(testEl);
                applier.undoToRange(range);
                t.equal(testEl.childNodes.length, 1);
                console.dir(testEl.firstChild)
                t.equal(testEl.firstChild, customElement);
                t.equal(testEl.firstChild.childNodes.length, 1);
                t.equal(testEl.firstChild.firstChild.nodeType, 3 */
    /*Node.TEXT_NODE*//*
);
            t.equal(testEl.firstChild.firstChild.textContent, "b");
        });

        QUnit.test("removeEmptyContainers ignores non-HTML elements (issue #178)", function(t) {
            var applier = createClassApplier("test");
            var testEl = document.getElementById("qunit-fixture");
            var customElement = document.createElementNS('my:custom:ns', 'span');
            // Make the custom element look somewhat like a HTML element
            customElement.setAttribute("class", "test");
            testEl.appendChild(customElement);
            var range = rangy.createRange();
            range.selectNode(testEl);
            applier.applyToRange(range);
            t.equal(testEl.childNodes.length, 1);
            t.equal(testEl.firstChild, customElement);
        });

        QUnit.test("Merging ignores non-HTML elements (issue #178)", function(t) {
            var applier = createClassApplier("test");
            var testEl = document.getElementById("qunit-fixture");
            testEl.innerHTML = "a";
            var customElement = document.createElementNS('my:custom:ns', 'span');
            // Make the custom element look somewhat like a HTML element
            customElement.setAttribute("class", "test");
            customElement.appendChild(document.createTextNode('b'));
            testEl.appendChild(customElement);
            var range = rangy.createRange();
            range.selectNode(testEl);
            applier.applyToRange(range);
            t.equal(testEl.childNodes.length, 2);
            t.equal(testEl.childNodes[0].outerHTML, '<span class="test">a</span>');
            t.equal(testEl.childNodes[1], customElement);
        });
*/

    QUnit.test("<svg> element support", function(t) {
        var applier = createClassApplier("test", {
            elementTagName: "tspan"
        });
        var testEl = document.getElementById("qunit-fixture");
        var range = createRangeInHtml(testEl, '<svg><text>1[2]3</text></svg>');
        applier.applyToRange(range);
        t.equal('<svg><text>1<tspan class="test">[2]</tspan>3</text></svg>', htmlAndRangeToString(testEl, range));
        applier.undoToRange(range);
        t.equal('<svg><text>1[2]3</text></svg>', htmlAndRangeToString(testEl, range));
    });
}

/*
if (rangy.features.selectionSupportsMultipleRanges) {
    QUnit.test("Undo to multiple ranges", function(t) {
        var testEl = document.getElementById("qunit-fixture");
        testEl.innerHTML = "<b>12</b>345";
        var applier = createClassApplier("c1");

        var textNode1 = testEl.firstChild.firstChild;
        var textNode2 = testEl.lastChild;

        var range1 = rangy.createRange();
        range1.setStartAndEnd(textNode1, 1, textNode2, 1);

        var range2 = rangy.createRange();
        range2.setStartAndEnd(textNode2, 2, 3);

        t.equal(range1.toString(), "23");
        t.equal(range2.toString(), "5");

        applier.applyToRanges([range1, range2]);

        t.equal(range1.toString(), "23");
        t.equal(range2.toString(), "5");

        applier.undoToRanges([range2, range2]);

        t.equal(range1.toString(), "23");
        t.equal(range2.toString(), "5");
    });

    QUnit.test("Undo to multiple ranges reverse order", function(t) {
        var testEl = document.getElementById("qunit-fixture");
        testEl.innerHTML = "<b>12</b>345";
        var applier = createClassApplier("c1");

        var textNode1 = testEl.firstChild.firstChild;
        var textNode2 = testEl.lastChild;

        var range1 = rangy.createRange();
        range1.setStartAndEnd(textNode1, 1, textNode2, 1);

        var range2 = rangy.createRange();
        range2.setStartAndEnd(textNode2, 2, 3);

        t.equal(range1.toString(), "23");
        t.equal(range2.toString(), "5");

        applier.applyToRanges([range2, range1]);

        t.equal(range1.toString(), "23");
        t.equal(range2.toString(), "5");

        applier.undoToRanges([range2, range1]);

        t.equal(range1.toString(), "23");
        t.equal(range2.toString(), "5");
    });
}
*/
QUnit.start();