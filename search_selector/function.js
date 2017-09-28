$(function(){

  //html生成
  $('body').prepend('<div id="plugin-search-tag"><span id="plugin-search-tag-close">close</span><p id="plugin-search-tag-text">検索したいセレクタを入力</p><div id="plugin-search-tag-submit"><input id="plugin-search-tag-input" type="text"><p id="plugin-search-tag-submit-class">search</p></div></div>');

  //設定
  //-----------------------------------//
  var $input = $('#plugin-search-tag-input');

  //function:検索処理
  //-----------------------------------//
  var searchFunction = function () {

    //function:ハイライト処理
    var highlightStyle = function ($selectorArg) {
      var highlightClass = 'plugin-search-highlightStyle';
      var $highlightClass = $('.'+highlightClass);
      $(document).find($highlightClass).removeClass(highlightClass);
      $(document).find($selectorArg).addClass(highlightClass);
    };

    //function:該当箇所へスクロール
    var scrollFunc = function($selectorArg){
      try{
        var ofsetH = $(document).find($selectorArg).first().offset().top - 150;//150は余白
        var tryFlag = true;
        $('body,html').animate({scrollTop: ofsetH},100);
      } catch(e){
        tryFlag = false;
      } finally {
        tryFunc($input,tryFlag);
      }
    };

    //start:検索値の取得
    var selector = $(document).find('#plugin-search-tag-input').val().trim();

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
      highlightStyle(selector);
      scrollFunc(selector);
      console.log('検索結果： '+selector+' で検索しました \n該当件数： '+String($(document).find(selector).length)+'件 ');
    }else{
      var selectorConvID = selector.replace(/^/,'#');
      var selectorConvClass = selector.replace(/^/,'.').replace(/[\s]+/g,'.');
      //セレクタを検索
      if($(selectorConvID).length){
        console.log('検索結果： '+selectorConvID+' で検索しました \n該当件数： '+String($(document).find(selectorConvID).length)+'件 ');
        highlightStyle(selectorConvID);
        scrollFunc(selectorConvID);
      }else if($(selectorConvClass).length){
        console.log('検索結果： '+selectorConvClass+' で検索しました \n該当件数： '+String($(document).find(selectorConvClass).length)+'件 ');
        highlightStyle(selectorConvClass);
        scrollFunc(selectorConvClass);
      }else if($(selector).length){
        highlightStyle(selector);
        scrollFunc(selector);
        console.log('検索結果： '+selector+' で検索しました \n該当件数： '+String($(document).find(selector).length)+'件 ');
      }else{
        highlightStyle(selector);
        scrollFunc(selector);
        console.log('該当なし：検索したセレクタ候補は存在しません');
      }
    }
  };

  //function:エラー時の警告
  //-----------------------------------//
  var tryFunc = function($selectorArg,tryFlagArg){
    var errorClass = 'is-error';
    if(tryFlagArg){
      $(document).find($selectorArg).removeClass(errorClass);
    }else{
      $(document).find($selectorArg).addClass(errorClass);
    }
  };

  //ボタン処理
  //-----------------------------------//
  //クローズボタン
  $(document).find('#plugin-search-tag-close').on('click',function () {
    $(document).find('#plugin-search-tag').hide();
  });

  //検索実行ボタン
  $(document).find('#plugin-search-tag-submit-class').on('click',function () {
    searchFunction();
    return false;
  });

  //キーボードアクション
  //-----------------------------------//
  //実行 cmd(enter)
  $(document).find('#plugin-search-tag-input').keydown(function (e) {
    if(e.keyCode===13){
      searchFunction();
      return false;
    }
  });
  //検索ツールの表示と検索フォームへフォーカス cmd(shift+cnt+F)
  $(window).keydown(function (e) {
    if(e.keyCode===70&&event.ctrlKey&&event.shiftKey||e.keyCode===70&&event.metaKey&&event.shiftKey){
      $(document).find('#plugin-search-tag').show();
      $(document).find('#plugin-search-tag-input').select();
      return false;
    }
  });
});