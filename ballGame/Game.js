$(document).ready(function(){
	// -- 데이터 정의 -- //
	
	// 공의 갯수
	var circleNumber = 0;
	
	// 공의 종류 - 크기(지름) / 크기(반지름) / 색 / 움직이는 속도
	var circleTypes = {
		"option" : ["color", "width", "border-radius", "speed"],
		"small" : ["black", 5, 2.5, 3000], // 3000 != 속도가아니고, 한 지점에서 다른 지점으로 움직일 때 걸리는 ms
		"medium" : ["blue", 15, 7.5, 4000],
		"large" : ["yellow", 30, 15, 5000]
	}
	
	// e.g. circleChoice 라는 변수에 small
	// circleTypes[circleChoice][0] == 색
	// circleTypes[circleChoice][1] == 지름
	// circleTypes[circleChoice][2] == 반지름
	// circleTypes[circleChoice][3] == 속도
	
	// 시간을 찍어주는 변수
	var t = 0;
	
	// 게임 실행 여부
	var gameOn = "false";
	
	// 마우스 좌표
	var mouseX;
	var mouseY;
	
	// -------------------- //
	
	// 마우스 움직임을 좌표에 담아주는 함수
	$("body").mousemove(function(event){
		mouseX = event.pageX;
		mouseY = event.pageY;
	})
	
	// 타이머
	function timer() {
		if(gameOn == "true"){
			// 0.01 (==10ms) 마다 t 값을 0.01 증가시키고
			// 증가된 t 값을 timer 클래스 하위 html에 찍어주기
			
			setTimeout(function(){
				t = t + 0.01;
				$(".timer").html(`<h1><div class="center">` + t.toFixed(2) + "</div></h1>");
				timer();
			}, 10)
			
		}
	}
	
	// 시작 버튼
	$(".startbutton").click(function(){
		// 시작에 해당하는 코드
		$(".startbutton").fadeToggle(500, function(){
			gameOn = "true";
			timer();
			// console.log("게임 시작");
			$(".space").mouseenter(function(){
				endgame();
			})
			// 공을 생성해주는 함수
			createCircle();
		});
	})
	
	// 공을 생성하는 함수
	function createCircle(){
		circleNumber++;
		
		// small medium large 셋 중 하나를 랜덤하게 생성
		// 우선 1부터 3까지의 함수 중 하나를 랜덤하게 생성
		var randomOneThree = Math.floor(3*Math.random()) + 1 // 1 or 2 or 3
		
		if(randomOneThree == 1){
			var circleChoice = "small";
		} else if (randomOneThree == 2){
			var circleChoice = "medium";
		} else if (randomOneThree == 3){
			var circleChoice = "large";
		};
		
		// 공의 id 값을 지정해줄 예정
		var circleName = "circle" + circleNumber;
		
		// 랜덤으로 생성된 circleChoice에 맞는 color, size(지름), radius(반지름), speed 변수에 담아주기
		var circleColor = circleTypes[circleChoice][0];
		var circleSize = circleTypes[circleChoice][1];
		var circleRadius = circleTypes[circleChoice][2];
		var circleSpeed = circleTypes[circleChoice][3];
		
		// 생성된 공은 각기 다른 크기를 가짐... 공이 움직일 수 있는 범위(가로길이, 세로길이) 지정
		var moveableWidth = $("body").width() - circleSize;
		var moveableHeight = $("body").height() - circleSize;
		
		// 공의 초기 시작 좌표
		var circlePositionLeft = (moveableWidth * Math.random()).toFixed();
		var circlePositionTop = (moveableHeight * Math.random()).toFixed();
		
		var newCircle = `<div class='circle' id="${circleName}"></div>`;
		$("body").append(newCircle);
		
		// 지금 생성된 Circle의 id값에 대한 CSS 지정
        // vmin vmax: https://gahyun-web-diary.tistory.com/115
        $("#" + circleName).css({
            "background-color": circleColor,
            "width": circleSize + "vmin",
            "height": circleSize + "vmin",
            "border-radius": circleRadius + "vmin",
            "top": circlePositionTop + "px",
            "left": circlePositionLeft + "px"
        });
		
		// ------ 랜먿한 공 생성 - 속성지정까지 ---------------//
		
		// 1ms 마다 반복실행하면서 마우스와의 거리를 계산하는 함수
	
		function timeCirclePosition(circleTrackID){
			setTimeout(function(){
				var currentCirclePosition = $(circleTrackID).position();
                var calculatedRadius = parseInt($(circleTrackID).css("width")) * 0.5;
                // 마우스와의 거리 계산 - 만일 거리가 반지름보다 작다면(맞닿았다면) 게임 종료
                var distanceX = mouseX - (currentCirclePosition.left + calculatedRadius);
                var distanceY = mouseY - (currentCirclePosition.top + calculatedRadius);
				if(Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) <= calculatedRadius){
					// 부딪힌 공을 빨간색으로 표시
					$(circleTrackID).removeClass("circle").addClass("redcircle");
					$(circleTrackID).css("background-color", "red");
		
					endgame();
				};
				timeCirclePosition(circleTrackID);
			}, 1);
		}
		timeCirclePosition("#" + circleName);
		
		animateCircle(circleName, circleSpeed, circleSize);
		
		// 3초에 한번 공 랜덤 생성
		setTimeout(function(){
			if(gameOn == "true"){
				createCircle();
			}
		}, 3000)
	};
	
	function animateCircle(circleId, speed, circleSize){
		
        var moveableWidth = $("body").width() - circleSize;
        var moveableHeight = $("body").height() - circleSize;
        var circleMoveLeft = (moveableWidth * Math.random()).toFixed();
        var circleMoveTop = (moveableHeight * Math.random()).toFixed();
	
		$("#" + circleId).animate({
            left: circleMoveLeft,
            top: circleMoveTop
        }, speed, function () {
            animateCircle(circleId, speed, circleSize);
        });
	}
	
	// 게임 오버 함수
	function endgame(){
		if(gameOn == "true"){
			gameOn = "false";
			updateScore(t);
			$(".circle").remove();
			$(".redCircle").stop();
		};
	};

	var resetButton = "<div class='resetbutton center'><h2>Play Again</h2></div>";
	
	var highScore1 = 0.00;
	var highScore2 = 0.00;
	var highScore3 = 0.00;
	var highScore4 = 0.00;
	var highScore5 = 0.00;
	
	function updateScore(newScore){
		// 방금 플레이에서 얻은 점수는 빨간색으로 표시할 예쩡
		// 새 점수가 highScore1 보다 높은 경우
        if(newScore > highScore1){
            var redScore="score1";  
            highScore5=highScore4;
            highScore4=highScore3;
            highScore3=highScore2;
            highScore2=highScore1;
            highScore1=newScore;
        }
        // 새 점수가 highScore2 보다 높은 경우
        else if(newScore > highScore2){
            var redScore="score2";
            highScore5=highScore4;
            highScore4=highScore3;
            highScore3=highScore2;
            highScore2=newScore;
        }
        // 새 점수가 highScore3 보다 높은 경우
        else if(newScore > highScore3){
            var redScore="score3";
            highScore5=highScore4;
            highScore4=highScore3;
            highScore3=newScore;
        }
        // 새 점수가 highScore4 보다 높은 경우
        else if(newScore > highScore4){
            var redScore="score4";
            highScore5=highScore4;
            highScore4=newScore;
        }
        // 새 점수가 highScore5 보다 높은 경우
        else if(newScore > highScore5){
            var redScore="score5";
            highScore5=newScore;
        };
		
		// createElemet로 해도 되지 않을까
        var highScorePlace1= "<div class='score center' id='score1'><h2>" + highScore1.toFixed(2) + "</h2></div>";
        var highScorePlace2= "<div class='score center' id='score2'><h2>" + highScore2.toFixed(2) + "</h2></div>";
        var highScorePlace3= "<div class='score center' id='score3'><h2>" + highScore3.toFixed(2) + "</h2></div>";
        var highScorePlace4= "<div class='score center' id='score4'><h2>" + highScore4.toFixed(2) + "</h2></div>";
        var highScorePlace5= "<div class='score center' id='score5'><h2>" + highScore5.toFixed(2) + "</h2></div>";
		
		// 만들어진 태그 append
		$("#highscores").append(highScorePlace1, highScorePlace2, highScorePlace3, highScorePlace4, highScorePlace5, resetButton);
        $("#"+redScore).css("color", "red");
        $("#highscores").toggle();
		
		 $(".resetbutton").click(function(){
            gameReset();
        });
	};
	
	function gameReset(){
		$("#highscores").fadeToggle(100, function(){
			t = 0;
			$(".timer").html("<h1 class='center'>"+ t.toFixed(2) + "</h1>"); // 지금까지의 시간 찍어주기
			$(".resetbutton").remove();	// 리셋버튼 없애기
            $(".score").remove();		// score 보드 없애기
            $(".startbutton").toggle();	// startbutton 생성
            $(".redcircle").remove();	// 부딪힌 공 없애기
		})
	}
})
