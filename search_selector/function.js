$(function(){

  //html生成
  $('body').prepend('<div id="plugin-search-selector"><span id="plugin-search-selector-close">close</span><p id="plugin-search-selector-text">検索したいセレクタを入力</p><div id="plugin-search-selector-submit"><input id="plugin-search-selector-input" type="text"><p id="plugin-search-selector-submit-class">search</p></div></div>');

  //設定
  //-----------------------------------//
  var $input = $('#plugin-search-selector-input');

  //function:検索処理
  //-----------------------------------//
  var repetitionFlag;
  var $thisIndex;
  var searchFunction = function (typeArg) {

    //function:ハイライト処理
    var highlightStyle = function ($selectorArg,$thisIndex) {
      var highlightClass = 'plugin-search-selector-highlightStyle';
      var highlightCurrentClass = 'plugin-search-selector-highlightCurrentStyle';
      var $highlightClass = $('.'+highlightClass);
      var $highlightCurrentClass = $('.'+highlightCurrentClass);
      $(document).find($highlightClass).removeClass(highlightClass);
      $(document).find($highlightCurrentClass).removeClass(highlightCurrentClass);
      $selectorArg.addClass(highlightClass);
      $selectorArg.eq($thisIndex).addClass(highlightCurrentClass);
    };
    //function:該当箇所へスクロール
    var scrollFunc = function($selectorArg,$thisIndex){
      try{
        var ofsetH = $selectorArg.eq($thisIndex).offset().top - 150;//150は余白
        var tryFlag = true;
        $('body,html').animate({scrollTop: ofsetH},100);
      } catch(e){
        tryFlag = false;
      } finally {
        tryFunc($input,tryFlag);
      }
    };
    //function:検索対象のループ
    var repetitionFunc = function ($selectorArg,typeArg) {
      var $thisSelector = $(document).find($selectorArg).filter(function () {
        if($(this).attr('id')&&!$(this).attr('id').match(/plugin-search-selector/g)){ return $(this); }
      });
      if( repetitionFlag && repetitionFlag === $selectorArg){
        //indexの選定 リバース処理
        if( !typeArg ){
          if($thisSelector.eq($thisIndex+1).length){
            $thisIndex ++;
          }else{
            $thisIndex = 0;
          }
        }else if( typeArg == 'reverse' ){
          if( $thisIndex > 0 ){
            $thisIndex --;
          }else{
            $thisIndex = $thisSelector.length;
          }
        }
      }else{
        $thisIndex = 0;
        if($thisSelector.length){
          console.log('検索結果： '+$selectorArg+' で検索しました \n該当件数： '+String($thisSelector.length)+'件');
        }
      }
      repetitionFlag = $selectorArg;
      highlightStyle($thisSelector,$thisIndex);
      scrollFunc($thisSelector,$thisIndex);
    };

    //start:検索値の取得
    var selector = $(document).find('#plugin-search-selector-input').val().trim();

    //start:検索値のフォーマット検知・生成
    var regExpId = /[#]/g;//ID
    var regExpClass = /[.]/g;//Class
    var regExpAttribute = /[\[\]]/g;//属性
    var regExpPseudo = /[:]/g;//疑似
    var regExpTag = /[<>]/g;//タグ
    var regExpComma = /[,]/g;//カンマ

    try{
      $(selector);
    }catch(e){
      console.log('入力したセレクタの文法に問題があります。');
      return false;
    }

    //start:検索値の判定(セレクタを適切に使用しているかの判定)
    if(selector.match(regExpId)||selector.match(regExpClass)||selector.match(regExpAttribute)||selector.match(regExpPseudo)||selector.match(regExpTag)||selector.match(regExpComma)){
      repetitionFunc(selector,typeArg);
    }else{
      var selectorConvID = selector.replace(/^/,'#');
      var selectorConvClass = selector.replace(/^/,'.').replace(/[\s]+/g,'.');
      //セレクタを検索
      if($(selectorConvID).length){
        repetitionFunc(selectorConvID,typeArg);
      }else if($(selectorConvClass).length){
        repetitionFunc(selectorConvClass,typeArg);
      }else if($(selector).length){
        repetitionFunc(selector,typeArg);
      }else{
        console.log('該当なし：検索したセレクタ候補は存在しません');
        repetitionFunc(selector,typeArg);
      }
    }
  };

  //function:エラー時の警告
  //-----------------------------------//
  var tryFunc = function($selectorArg,tryFlagArg){
    var errorClass = 'plugin-search-selector-is-error';
    if(tryFlagArg){
      $(document).find($selectorArg).removeClass(errorClass);
    }else{
      $(document).find($selectorArg).addClass(errorClass);
    }
  };

  //ボタン処理
  //-----------------------------------//
  //クローズボタン
  $(document).find('#plugin-search-selector-close').on('click',function () {
    $(document).find('#plugin-search-selector').hide();
  });

  //検索実行ボタン
  $(document).find('#plugin-search-selector-submit-class').on('click',function () {
    searchFunction();
    return false;
  });

  //キーボードアクション
  //-----------------------------------//
  //実行 cmd(enter)
  $(document).find('#plugin-search-selector-input').keydown(function (e) {
    if(e.keyCode===13&&!event.shiftKey){
      searchFunction();
      return false;
    }
  });
  //実行 cmd(enter+shift)
  $(document).find('#plugin-search-selector-input').keydown(function (e) {
    if(e.keyCode===13&&event.shiftKey){
      searchFunction('reverse');
      return false;
    }
  });
  //検索ツールの表示と検索フォームへフォーカス cmd(shift+cnt+F)
  $(window).keydown(function (e) {
    if(e.keyCode===70&&event.ctrlKey&&event.shiftKey||e.keyCode===70&&event.metaKey&&event.shiftKey){
      $(document).find('#plugin-search-selector').show();
      $(document).find('#plugin-search-selector-input').select();
      return false;
    }
  });
});