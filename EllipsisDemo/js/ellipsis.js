/**
 * Created by chinghsu on 15/11/13.
 */
$(document).ready(function () {
	$('p').each(function () {
		var trimLength = 100;
		var trimMargin = 1.2; // don't trim just a couple of words
		if ($(this).text().length > (trimLength * trimMargin)) {
			var text = $(this).text();
			var trimPoint = $(this).text().indexOf(" ", trimLength);
			//var newContent = text.substring(0, trimPoint) + '<span class="read-more">' + text.substring(trimPoint) + '<a class="less" href="#">(less)</a></span><span class="toggle">... <a class="more" href="#">(more)</a></span>';
			var newContent = text.substring(0, trimPoint) + '<span class="read-more">' + text.substring(trimPoint) + '<a class="less" href="#">&#xf100;</a></span><span class="toggle">... <a class="more" href="#">&#xf101;</a></span>';
			$(this).html(newContent);
		}
	});
	var para_initial;
	$('.toggle a.more').click(function (e) {
		para_initial=para_initial||$(this).closest('p').innerHeight();
		e.preventDefault();
		var para = $(this).closest('p');
		var initialHeight = $(this).closest('p').innerHeight();
		para.find('.read-more').show();
		para.find('.toggle').hide();
		var newHeight = para.innerHeight();
		para.css('max-height', initialHeight + 'px');
		para.animate({
			maxHeight: newHeight
		}, "slow", function () {
			//para.css('height', newHeight + 'px');
			para.css('max-height',"none");
		});
	});
	$('.read-more a.less').click(function (e) {
		e.preventDefault();
		var para = $(this).closest('p');
		var initialHeight = $(this).closest('p').innerHeight();
		//var newHeight = para.innerHeight();
		para.css('max-height', initialHeight + 'px');
		para.animate({
			maxHeight: para_initial
		}, "slow", function () {
			//para.css('max-height', para_initial + 'px');
			para.find('.read-more').hide();
			para.find('.toggle').show();
			para.css('max-height',"none");
		});
	});
});