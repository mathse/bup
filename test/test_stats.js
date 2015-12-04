var assert = require('assert');

var tutils = require('./tutils');
var bup = tutils.bup;
var _describe = tutils._describe;
var _it = tutils._it;

(function() {
'use strict';

_describe('stats', function() {
	_it('test stats calc', function() {
		var presses = [{
			type: 'pick_side',
			team1_left: true,
			timestamp: 1000,
		}, {
			type: 'pick_server',
			team_id: 0,
			player_id: 0,
			timestamp: 2000,
		}, {
			type: 'pick_receiver',
			team_id: 1,
			player_id: 0,
			timestamp: 3000,
		}, {
			type: 'love-all',
			timestamp: 120000,
		}];
		for (var i = 1; i <= 10;i++) {
			presses.push({
				type: 'score',
				side: 'left',
				timestamp: 120000 + i * 10000,
			});
		}
		presses.push({
			type: 'score',
			side: 'right',
			timestamp: 230000,
		});
		var s = tutils.state_after(presses, tutils.DOUBLES_SETUP);
		var st = bup.stats.calc_stats(s).cols;
		assert.strictEqual(st.length, 1 + 1);
		assert.strictEqual(st[0].points, '10-1');
		assert.strictEqual(st[0].points_lr, '10/1');
		assert.strictEqual(st[0].duration, '1:50');
		assert.deepStrictEqual(
			st[0].rally_lengths,
			[10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000]);
		assert.strictEqual(st[0].avg_rally_length, '0:10');
		assert.deepStrictEqual(
			st[0].serves,
			[[11, 0], [0, 0]]
		);
		assert.strictEqual(st[1].points, '10-1');
		assert.strictEqual(st[1].points_lr, '10/1');
		assert.strictEqual(st[1].duration, '1:50');
		assert.strictEqual(st[1].avg_rally_length, '0:10');

		presses.push({
			type: 'score',
			side: 'left',
			timestamp: 250000,
		});
		s = tutils.state_after(presses, tutils.DOUBLES_SETUP);
		st = bup.stats.calc_stats(s).cols;
		assert.strictEqual(st.length, 1 + 1);
		assert.strictEqual(st[0].points, '11-1');
		assert.strictEqual(st[0].points_lr, '11/1');
		assert.strictEqual(st[0].duration, '2:10');
		assert.deepStrictEqual(
			st[0].rally_lengths,
			[10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 20000]);
		assert.strictEqual(st[0].avg_rally_length, '0:11');
		assert.deepStrictEqual(
			st[0].serves,
			[[11, 0], [0, 1]]
		);
		assert.strictEqual(st[1].points, '11-1');
		assert.strictEqual(st[1].points_lr, '11/1');
		assert.strictEqual(st[1].duration, '2:10');
		assert.strictEqual(st[1].avg_rally_length, '0:11');

		presses.push({
			type: 'score',
			side: 'left',
			timestamp: 320000,
		});
		presses.push({
			type: 'score',
			side: 'left',
			timestamp: 330000,
		});
		s = tutils.state_after(presses, tutils.DOUBLES_SETUP);
		st = bup.stats.calc_stats(s).cols;
		assert.strictEqual(st.length, 1 + 1);
		assert.strictEqual(st[0].points, '13-1');
		assert.strictEqual(st[0].points_lr, '13/1');
		assert.strictEqual(st[0].duration, '3:30');
		assert.strictEqual(st[0].avg_rally_length, '0:11');
		assert.deepStrictEqual(
			st[0].serves,
			[[11, 2], [0, 1]]
		);
		assert.strictEqual(st[1].points, '13-1');
		assert.strictEqual(st[1].points_lr, '13/1');
		assert.strictEqual(st[1].duration, '3:30');
		assert.strictEqual(st[1].avg_rally_length, '0:11');

		presses.push({
			type: 'score',
			side: 'left',
			timestamp: 330000,
		});
		presses.push({
			type: 'score',
			side: 'left',
			timestamp: 330000,
		});
		presses.push({
			type: 'score',
			side: 'right',
			timestamp: 330000,
		});
		presses.push({
			type: 'score',
			side: 'left',
			timestamp: 330000,
		});
		s = tutils.state_after(presses, tutils.DOUBLES_SETUP);
		st = bup.stats.calc_stats(s).cols;
		assert.deepStrictEqual(
			st[0].serves,
			[[11, 5], [1, 1]]
		);
	});
});

})();