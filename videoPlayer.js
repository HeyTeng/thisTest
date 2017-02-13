function VideoPlayer(videoPanel,videoName,url,autoPlay,showControls){
	var O = {};
	var $eventer=$(O);
	var isPlaying = false,
		isMuted = false;
	var $videoPanel = $(videoPanel),
		$video = $videoPanel.find('.video'),
		$bigPlayBtn = $videoPanel.find('.big-play-btn'),
		$bigSoundBtn = $videoPanel.find('.big-sound-btn'),
		$firstFrame = $videoPanel.find('.video-first-frame'),
		$loading = $videoPanel.find('.video-loading'),
		$bigReplayBtn = $videoPanel.find('.big-replay-btn'),
		$controlBtns = $videoPanel.find('.control-btns'),
		$play_pauseBtn = $videoPanel.find('.play-pause-btn'),
		$min_playBtn = $videoPanel.find('.play-pause-btn .play-btn'),
		$min_pauseBtn = $videoPanel.find('.play-pause-btn .pause-btn'),
		$mute_unmuteBtn = $videoPanel.find('.mute-unmute-btn'),
		$progress = $videoPanel.find('.progress'),
		$progessBg = $videoPanel.find('.progessBg'),
		$sliderPlayLine = $videoPanel.find('.sliderPlayLine'),
		$progressBarC = $videoPanel.find('.progressBarC'),
		video = $video[0];
 	
 	O.isTouchFrist = false;
 	O.isFrist = true;
 	O.isAutoPlay = false;
 	O.recordLastMute = true;
	var $imgAnim = $videoPanel.find('.btn-anim');
	var $selectAnim = $videoPanel.find('.select-btn-anim');
	var $selectedAnim = null;
	var isCanPlay = false;
	var tiemId = 0;
	var isLoaded = false;
	var isSeeking = false;
	var isCanShow = false;
	var isEnd = false;
	var isBarDown = false;
	var timer = null;
	var onlyFirst = false;

	var firstStartFlag = true;
	var firstQuartileFlag = true;
	var midPointFlag = true;
	var threeQuartileFlag = true;

	var isStartmute=true,isShowBigSound=true;
	var isloading = false;
	var n = 0;
	var pt = 0;
	initVideo();
	initEvent();
	setloadAnim();
	loadAnim();
	var bufferedEnd_Id;
	var bufferedEnd = false;

	var loadTL;
	var isplayLoading = true;
	function loadAnim(){
		
	    // TweenMax.from($loading.find('.loading'),0.8,{rotation:-360,ease:Linear.easeNone,onComplete:function(){
	    // 	console.log('.....',isPlaying)
	    //     if(isPlaying)loadAnim();
	    // }});
	    isplayLoading = true;
	    loadTL.play();
	}

	function setloadAnim(){
		loadTL = new TimelineMax();

		loadTL.to($loading.find('.loading'),0.8,{rotation:360,repeat:-1,ease:Linear.easeNone})
	}

	function stoploadAnim(){
		isplayLoading = false;
		loadTL.pause();
	}
	function bufferedEndVideo()
	{
		bufferedEnd_Id = setInterval(function(){
			try{
				if(video&&video.duration&&video.buffered&&video.buffered.end()>=(video.duration-0.05))
				{
					bufferedEnd = true;
					if(autoPlay || isPlaying)
					{
						O.startVideo(isStartmute,isShowBigSound);
					}
						clearInterval(bufferedEnd_Id);
				}
			}catch(e)
			{
					if(autoPlay)
					{
						if(!isplayLoading)loadAnim();
						TweenMax.set($loading,{autoAlpha:1});
					}

					bufferedEnd = true;
					if(autoPlay || isPlaying)
					{
						O.startVideo(isStartmute,isShowBigSound);
					}
					clearInterval(bufferedEnd_Id);
			}
		},1000)
	}

	function initVideo(){
		video.innerHTML='<source id="video_1_mp4_src_dc"'+videoName.toString()+' type="video/mp4" src="'+Enabler.getUrl(url)+'" />';
		video.preload='meta';
		video.addEventListener("canplay", function(){
			if(O.isLoaded) return;
			isCanPlay = true;

			O.hideControls();
			if(autoPlay || isPlaying){
				if(bufferedEnd)
				O.startVideo(isStartmute,isShowBigSound);
			} 
		});
		bufferedEndVideo();
		video.addEventListener("ended", function(){
			TweenMax.set($min_playBtn,{autoAlpha:1});
			TweenMax.set($min_playBtn.find('.over'),{opacity:0});
			TweenMax.set($min_pauseBtn,{autoAlpha:0});
            $(document).off('mouseup');
            $(document).off('mousemove');
			isEnd = true;
			isPlaying = false;
			isCanShow = false;
			// O.hideControls();
			$play_pauseBtn.removeClass('play');
			if(showControls){
				TweenMax.set([$loading,$firstFrame,$bigSoundBtn,$bigPlayBtn],{autoAlpha:0});
				TweenMax.set($bigReplayBtn,{onComplete:function(){
					var _hideBigPlay=0;
					timer = setInterval(function(){
						TweenMax.set($bigPlayBtn,{autoAlpha:0});
						_hideBigPlay++;
						if(_hideBigPlay>50){
							clearInterval(timer);
						}
					},10);
				}});
			}
			TweenMax.to('.end_frame',0.3,{autoAlpha:1});
			O.trigger('videoPlayEnd');

			O.playBtnType();

			stoploadAnim();
		});
		video.addEventListener('seeking',function(){
			if(!isBarDown) isSeeking = true;
		})
		video.addEventListener('seeked',function(){
			if(!isBarDown) isSeeking = false;
			TweenMax.set($loading,{autoAlpha:0});
			stoploadAnim();
		});
		video.addEventListener('readyState',function(e){
			// console.log('video-loaded',e);
		});
		video.addEventListener('onload',function()
		{
			// console.log('video.onload');
		})
	}
	function initEvent(){

		setInterval(function(){
			var firstQuartile = Math.floor(video.duration*0.25);
			var midPoint = Math.floor(video.duration*0.5);
			var threeQuartile = Math.floor(video.duration*0.75);
			if(1 == Math.floor(video.currentTime) && firstStartFlag){
				firstStartFlag = false;
				
			}
			else if(firstQuartile == Math.floor(video.currentTime) && firstQuartileFlag){
				firstQuartileFlag = false;
			}
			else if(midPoint == Math.floor(video.currentTime) && midPointFlag){
				midPointFlag = false;
				console.log(midPointFlag);
			}
			else if(threeQuartile == Math.floor(video.currentTime) && threeQuartileFlag){
				threeQuartileFlag = false;
			}
	
		},1000);
		if(!showControls){
			TweenMax.set([$bigPlayBtn,$bigReplayBtn,$bigSoundBtn,$controlBtns],{autoAlpha:0});
			return;
		} 
		$imgAnim.on('mouseenter',function(e){
			var $over = $(this).find('.over');
			TweenMax.to($over,.3,{opacity:1});
			if($(this).hasClass('big-replay-btn')){
				TweenMax.set($(this).find('.replay-btn'),{rotation:0})
				TweenMax.to($(this).find('.replay-btn'),.5,{rotation:-360});
			}
		});
		$imgAnim.on('mouseleave',function(e){
			var $over = $(this).find('.over');
			TweenMax.to($over,.3,{opacity:0});
		});

		 // play-pause--btn
		$selectAnim.on('mouseleave',function(e){
			if($selectedAnim[0]==$(this)[0])return;
			var $over = $(this).find('.over');
			TweenMax.to($over,.3,{opacity:0});
		});
		$selectAnim.on('mouseenter',function(e){
			if($selectedAnim[0]==$(this)[0])return;
			var $over = $(this).find('.over');
			TweenMax.to($over,.3,{opacity:1});
		})
// 
		/*bigBtn*/
		$bigPlayBtn.on('click',function(){
			// return false;
			TweenMax.set($bigPlayBtn,{autoAlpha:0});
			O.playVideo();
			isCanShow = true;
			O.showControls();
			if(isSeeking){
				TweenMax.set($loading,{autoAlpha:1});
				if(!isplayLoading)loadAnim();
			} 
		});
		$bigSoundBtn.on('click',function(){
			TweenMax.set($bigSoundBtn,{autoAlpha:0});
			O.unmuteVideo();
			O.replayVideo();
			isCanShow = true;
			O.showControls();
		});
		$bigReplayBtn.on('click',function(){
			// return false;
			firstQuartileFlag = true;
			midPointFlag = true;
			threeQuartileFlag = true;
			isEnd = false;
			TweenMax.set($bigReplayBtn,{autoAlpha:0});
			O.replayVideo();
			if(O.isAutoPlay)O.unmuteVideo();
			O.isAutoPlay = false;
			isCanShow = true;
			O.showControls();
			O.trigger('clickToReplay');
			clearInterval(timer);
		});

		$min_pauseBtn.on('click',function(){
			TweenMax.set($bigPlayBtn,{autoAlpha:1});
			TweenMax.set($min_playBtn,{autoAlpha:1});
			TweenMax.set($min_playBtn.find('.over'),{opacity:1});
			TweenMax.set($min_pauseBtn,{autoAlpha:0});
			O.pauseVideo();
		})
		$min_playBtn.on('click',function(){
			TweenMax.set($min_playBtn,{autoAlpha:0});
			TweenMax.set($min_pauseBtn,{autoAlpha:1});
			TweenMax.set($min_pauseBtn.find('.over'),{opacity:1});
			O.playVideo();
		})
		$mute_unmuteBtn.on('click',function(){
			if(isMuted){
				TweenMax.set($('.unmute-btn').find('.over'),{opacity:1});
				O.unmuteVideo();
			}else{
				TweenMax.set($('.mute-btn').find('.over'),{opacity:1});
				O.muteVideo();
			}
		})
		$progress.on('click',function(e){
			//------------endframe-------
			if(isEnd){
				O.playVideo();
				isEnd = false;
			}

			var l = $progessBg.width();
			var dw = e.pageX - $progress.offset().left;
            if(dw<0) dw = 0;
            if(dw>=l) dw = l;
            var cx = dw/l*100;
            var t = dw/l*video.duration;
            TweenMax.set($loading,{autoAlpha:1});
            if(!isplayLoading)loadAnim();

            TweenMax.set($sliderPlayLine,{width:cx+'%'});
			TweenMax.set($progressBarC,{left:cx+'%'});
            O.seekVideo(t);
            if(Math.floor(video.currentTime) >= Math.floor(video.duration*0.75)){
            	if(firstQuartileFlag){
            		firstQuartileFlag = false;
            	}
				if(midPointFlag){
					midPointFlag = false;
				}
				if(threeQuartileFlag){
					threeQuartileFlag = false;
				}	
            }else if(Math.floor(video.currentTime) >= Math.floor(video.duration*0.5)){
            	if(firstQuartileFlag){
            		firstQuartileFlag = false;
            	}
				if(midPointFlag){
					midPointFlag = false;
				}
            }else if(Math.floor(video.currentTime) >= Math.floor(video.duration*0.25)){
            	if(firstQuartileFlag){
            		firstQuartileFlag = false;
            	}
            }
		});
		$progressBarC.on('mousedown',function(e)
        {
        	var l = $progessBg.width();
        	isBarDown = true;
        	isSeeking = true;
        	video.pause();
        	TweenMax.set($loading,{autoAlpha:1});
        	if(!isplayLoading)loadAnim();
            $(document).on('mousemove',function(e)
            {
            	if(isEnd) return; 
                var dw = e.pageX - $progress.offset().left;
                if(dw<0)
                    dw = 0;
                if(dw>=l)
                    dw = l;
                var cx = dw/l*100;
            	var t = dw/l*video.duration;
                TweenMax.set($sliderPlayLine,{width:cx+'%'});
				TweenMax.set($progressBarC,{left:cx+'%'});
	            O.seekVideo(t);
            });
            $(document).on('mouseup',function(e)
            {
            	setTimeout(function(){
					isBarDown = false;
            	},50);
            	video.play();
            	isSeeking = false;
                $(document).off('mouseup');
                $(document).off('mousemove');
            })
        });
		$videoPanel.on('mouseenter',function(){
			if(isCanShow && !isBarDown && onlyFirst&&bufferedEnd && !isloading) O.showControls();
		})
		$videoPanel.on('mouseleave',function(){
		})
		$videoPanel.on('click',function(e){
			if(!O.isLoaded)
				return false;
			if($(e.target).hasClass('controls-container') || $(e.target).parents('.video-loading').length>0 || $(e.target).hasClass('video-loading')){
				if(isBarDown) return false;
				isCanShow = false;
				O.hideControls();
				TweenMax.set($bigPlayBtn,{autoAlpha:1});
				O.pauseVideo();
			}
		})
	}
	function updateProgress(){		
		tiemId = setInterval(function(){
			if(!isPlaying || isSeeking||!bufferedEnd) return false;
			var l = $progessBg.width();
			var ct = video.currentTime;
			var tt = video.duration;
			if(!isLoaded) {
				if(ct>=.02){
					TweenMax.to($firstFrame,.2,{autoAlpha:0});
					isLoaded = true;
					O.isLoaded = isLoaded;
				} 
			}
			var cx = ct/tt*100;
			TweenMax.set($sliderPlayLine,{width:cx+'%'});
			TweenMax.set($progressBarC,{left:cx+'%'});
			updateLoading(ct);
		},30)
	}
	function updateLoading(ct){
		n+=1;
		if(n%7==0){
			n=1;
			var _iscanLoading = (ct<=.002)||(pt == ct)||(!bufferedEnd);
			TweenMax.set($loading,{autoAlpha:_iscanLoading?1:0});
				_iscanLoading?(isplayLoading?null:loadAnim()):stoploadAnim();
			if(pt == ct){
				if(!onlyFirst){
					isloading = true;
					O.hideControls();
				}
			}else{
				if(!onlyFirst){
					O.showControls();
					onlyFirst = true;
				}
					isloading = false;
			}
			pt = ct
		}
	}
	O.isPlaying = function(){
		console.log(isPlaying)
		return isPlaying;
	};
	O.playBtnType = function(){
		if(isPlaying){
			$selectedAnim = $min_playBtn;
			// TweenMax.to($min_pauseBtn.find('.over'),0.2,{opacity:1});
			// TweenMax.to($min_playBtn.find('.over'),0.2,{opacity:0});
		}else{
			$selectedAnim = $min_pauseBtn;
			// TweenMax.to($min_pauseBtn.find('.over'),0.2,{opacity:0});
			// TweenMax.to($min_playBtn.find('.over'),0.2,{opacity:1})
		}
	} 
	O.startVideo = function(isMute,showBigSound){
		if(!isMute&&O.isFrist)
			O.isFrist = false;
		isPlaying = true;
		isStartmute = isMute;
		isShowBigSound = showBigSound;
		isMute?O.muteVideo():O.unmuteVideo();
		if(showBigSound && showControls)
		{
			isCanShow = false;
			TweenMax.set($bigSoundBtn,{autoAlpha:1});
		}else{
			isCanShow = true;
			TweenMax.set($bigSoundBtn,{autoAlpha:0});
		}
		$play_pauseBtn.addClass('play');
		TweenMax.set($bigPlayBtn,{autoAlpha:0});
		TweenMax.set($loading,{autoAlpha:1});//,$firstFrame]
		if(!isplayLoading)loadAnim();
		if(!isLoaded)TweenMax.set($firstFrame,{autoAlpha:1});
		O.hideControls();
		if(!isCanPlay) return;
		updateProgress();
		O.trigger('replayVideo');
		if(bufferedEnd)video.play();

		O.playBtnType();
	}
	O.replayVideo = function (){
		if(O.isFrist)
			O.isFrist = false;
		isLoaded = false;
		isCanShow = true;
		isPlaying = true;
		isSeeking = false;
		$play_pauseBtn.addClass('play');
		TweenMax.set([$loading,$firstFrame],{autoAlpha:1});
		if(!isplayLoading)loadAnim();
		TweenMax.set([$bigPlayBtn,$bigReplayBtn],{autoAlpha:0});
		TweenMax.set($sliderPlayLine,{width:0});
		TweenMax.set($progressBarC,{left:0});
		if(bufferedEnd)
		{
			video.currentTime=0;
			video.play();
		}
		if(isMuted)
			O.unmuteVideo();
		TweenMax.set('.end_frame',{autoAlpha:0});
		O.trigger('replayVideo');
		O.showControls();

		O.playBtnType();
	}
	O.playVideo = function (){
		
		TweenMax.set('.end_frame',{autoAlpha:0});
		isPlaying = true;
		$play_pauseBtn.addClass('play');
		TweenMax.set($bigPlayBtn,{autoAlpha:0});
		if(O.isFrist)
			O.startVideo(false,false);
		else
			video.play();
		O.trigger('playVideo');

		O.playBtnType();
		
	}
	O.pauseVideo = function (){
		clearInterval(timer);
		if(isPlaying){
			video.pause();
		}
		isPlaying = false;
		$play_pauseBtn.removeClass('play');
		TweenMax.set($bigPlayBtn,{autoAlpha:1});
		TweenMax.set($loading,{autoAlpha:0});
		stoploadAnim();
		O.trigger('pauseVideo');

		O.playBtnType();
	}
	O.stopVideo = function (){
		clearInterval(timer);
		isPlaying = false;
		$play_pauseBtn.removeClass('play');
		TweenMax.set('.end_frame',{autoAlpha:1});
		//TweenMax.set($bigPlayBtn,{autoAlpha:1});
		video.pause();
		O.trigger('stopVideo');

		O.playBtnType();
	}
	O.muteVideo = function(){
		isMuted = true;
		$mute_unmuteBtn.removeClass('unmute');
		video.volume=0;
	}
	O.unmuteVideo = function(){
		isMuted = false;
		$mute_unmuteBtn.addClass('unmute');
		video.volume=1;
	}
	O.seekVideo = function(time){
		video.currentTime = time;
	}
	O.trigger = function(type){
		$eventer.trigger(type);
	}
	O.addVideoEventListener = function(type,handle){
		$eventer.bind(type,handle)
	}
	O.showControls = function(){
		TweenMax.to($controlBtns,.3,{autoAlpha:1});
	}
	O.hideControls = function(){
		// TweenMax.to($controlBtns,.3,{autoAlpha:0});
	}
	O.counter = function(str){
	};
	O.clearVideo = function(){
		clearInterval(timer);
		firstStartFlag = true;
		TweenMax.set('.end_frame',{autoAlpha:1});
		if(isPlaying)video.pause();
		isPlaying = false;
		isCanShow = false;
		$play_pauseBtn.removeClass('play');
		TweenMax.set($bigPlayBtn,{autoAlpha:1});
		TweenMax.set($loading,{autoAlpha:0});
		if(!isplayLoading)loadAnim();
		video.currentTime = 0;
		TweenMax.set($sliderPlayLine,{width:'0%'});
		TweenMax.set($progressBarC,{left:'0%'});
		TweenMax.set($bigPlayBtn,{autoAlpha:1});
		TweenMax.set($bigReplayBtn,{autoAlpha:0});

		O.playBtnType();
	};
	O.isLoaded = isLoaded;
	
	O.videoPanel = $videoPanel;
	return O;
}