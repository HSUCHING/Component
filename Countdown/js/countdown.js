/**
 * Created by chinghsu on 15/12/14.
 */
function countdown(time) {

	var $days = $('.days'),
		$hours = $('.hours'),
		$mins = $('.minutes'),
		$secs = $('.seconds');
	var time = time;

	function format(v) {
		return (v.toString().length == 1) ? '0' + v : v;
	}

	var cdInterval = setInterval(clock, 1000);

	function clock() {
		if (true) {
			var seconds = Math.floor((time) % 60);
			var minutes = Math.floor((time / 60) % 60);
			//var hours = Math.floor((time / 3600) % 24);
			//var days = Math.floor((time / 86400));
			$secs.text(format(seconds));
			$mins.text(format(minutes));
			//$hours.text(format(hours));
			//$days.text(days);
			//if (!(seconds || minutes || hours || days)) {
			//	clearInterval(cdInterval);
			//	$(".countdown").addClass("vibration");
			//}
			if (!(seconds || minutes)) {
				clearInterval(cdInterval);
				$(".countdown").addClass("vibration");
			}
			time--;
		}
	}

}

countdown(65);