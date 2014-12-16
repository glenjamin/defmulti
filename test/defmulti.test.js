/*eslint-env mocha*/
var expect = require('chai').expect;

var defmulti = require('..');

describe("defmulti", function() {
    var f;
    describe("no dispatch function", function() {
        beforeEach(function() { f = defmulti(); });
        it("should dispatch on first arg", function() {
            f.method(0, function() { return 'red'; });
            f.method(1, function() { return 'green'; });

            expect(f(0)).to.eql('red');
            expect(f(1)).to.eql('green');
        });
        shouldBehaveLikeMultiMethod(0, [0]);
    });
    describe("w/ dispatch function", function() {
        beforeEach(function() {
            f = defmulti(function(x) { return x % 2 ? 'odd' : 'even'; });
        });
        it("should dispatch using function", function() {
            f.method('even', function(n) { return n * 2; });
            f.method('odd', function(n) { return n - 1; });

            expect(f(10)).to.eql(20);
            expect(f(5)).to.eql(4);
        });
        shouldBehaveLikeMultiMethod('even', [2]);
    });
    describe('array as dispatch value', function() {
        beforeEach(function() {
            f = defmulti(function(x, y) { return [typeof x, typeof y]; });
        });
        it('should dispatch against arrays', function() {
            f.method(['number', 'number'], function(x, y) {
                return x * y;
            });
            f.method(['number', 'string'], function(x, y) {
                return Array(x + 1).join(y);
            });

            expect(f(5, 10)).to.eql(50);
            expect(f(5, 'x')).to.eql('xxxxx');
        });
        shouldBehaveLikeMultiMethod(['number', 'number'], [1, 1]);
    });

    function shouldBehaveLikeMultiMethod(val, args) {
        it("should dispatch to fallback if nothing matches", function() {
            f.method(function() { return 'fallback'; });
            expect(f(1)).to.eql('fallback');
        });
        it("should throw if no fallback", function() {
            expect(function() { f(1); }).to.throw(Error, /no matching/i);
        });
        it("should pass arguments through to callers", function() {
            f.method(val, function() {
                return ['match', [].slice.call(arguments)];
            });
            f.method(function() {
                return ['fallback', [].slice.call(arguments)];
            });
            var x = {};
            var moreArgs = args.concat(['a', x]);

            expect(f.apply(0, moreArgs)).to.eql(['match', moreArgs]);
            expect(f(1, 'a', x)).to.eql(['fallback', [1, 'a', x]]);
        });

        it("should preserve `this`", function() {
            var x = { f: f };
            x.f.method(val, function() { return ['match', this]; });
            x.f.method(function() { return ['fallback', this]; });

            expect(f.apply(x, args)).to.eql(['match', x]);
            expect(f.call(x, 1)).to.eql(['fallback', x]);
        });
    }
});
