/* smooth scroll from bottom to top */
$("#goTop").on("click", function() {
    $.smoothScroll({
        easing: "easeOutExpo",
        speed: 500
    });
});

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
var board = {
    contextRoot : "/~MacintoshHD/php001/index.php/board/",
    ele : {
        grp : 0,
        grpSeq : 1,
        depth : 0
    },
    pageable : {
        pageNo : 1,
        size : 10,
        searchType : undefined,
        searchKeyword : undefined
    }
};


//////////////////////////////////////////////////////////////////////
///////////////////////////////create/////////////////////////////////
//////////////////////////////////////////////////////////////////////
/*board regist modal click init input tag*/
$("#newPostBtn").click(function() {
    $("#newPostModal input#writer").val("");
    $("#newPostModal input#password").val("");
    $("#newPostModal input#title").val("");
    $("#newPostModal input#attachFiles").val("");
    $("#newPostModal textarea").val("");
    $("#newPostModal #attachFiles").val("");
    $("#newPostModal #attachFileThumbDiv").html("");
    $("#newPostModal #cntMsg").html("200 remaining");
    attachFiles = [];
    attachFileIndex = 0;
    attachFileCnt = 0;
});

/* check exceeding 200 characters */
$("#newPostModal #content").keyup(function() {
    var maxByte = 200;
    chkword(this, maxByte);
}).autoGrow();

function chkword(obj, maxByte) {
    var strValue = obj.value;
    var strLen = strValue.length;
    var totalByte = 0;
    var len = 0;
    var oneChar = "";
    var str2 = "";

    for (var i = 0; i < strLen; i++) {
        oneChar = strValue.charAt(i);
        if (oneChar.length > 4) {
            totalByte += 2;
        } else {
            totalByte++;
        }
        if (totalByte <= maxByte) {
            len = i + 1;
        }
    }

    $("#newPostModal #cntMsg").html((maxByte - totalByte) + " remaining");
    if (totalByte > maxByte) {
        alert("Can not exceed 200 characters.");
        str2 = strValue.substr(0, len);
        obj.value = str2;
        chkword(obj, maxByte);
    }
}


/* image file upload */
$("#newPostModal #searchImage").click(function() {
    $("#newPostModal #attachFiles").trigger("click");
    return false;
});

var attachFiles = [];
var attachFileIndex = 0;
var attachFileCnt = 0;

$("#newPostModal #attachFiles").change(function(event) {
    event.preventDefault();
    event.stopPropagation();

    var files = event.target.files;
    imageUtil(files);

    $(this).val("");
    return false;
});

$(".file-drop").on("dragenter dragover", function(event) {
    event.preventDefault();
    event.stopPropagation();
    $("#newPostModal .file-drag").css("opacity", "0.7");
}).on("drop", function(event) {
    event.preventDefault();
    event.stopPropagation();
    $("#newPostModal .file-drag").css("opacity", "0");

    var files = event.originalEvent.dataTransfer.files;
    imageUtil(files);
}).on("dragleave dragend", function(event) {
    event.preventDefault();
    event.stopPropagation();
    $("#newPostModal .file-drag").css("opacity", "0");
});

function imageUtil(files) {
    var filesLen = files.length;
    var filesize = 0;

    for(var i = 0; i < filesLen; i++) {
        var imageFile = files[i];
        filesize += imageFile.size;
    }

    for(var i = 0; i < filesLen; i++) {
        var imageFile = files[i];
        var imageFileName = imageFile.name;
        var imageRegex = /\.(jpeg|jpg|gif|png)$/i;

        if(filesize <= 10485760 && imageRegex.test(imageFileName)) {
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = function(event) {
                var imageThumbnail = event.target.result;
                var attachFileThumb =
                    '<div class="col-md-4" id="attachFileThumb' + attachFileIndex + '">' +
                    '<div class="thumbnail-wrapper">' +
                    '<div class="thumbnail" id="thumbnail' + attachFileIndex + '">' +
                    '<div class="centered">' +
                    '<img src="' + imageThumbnail + '">' +
                    '</div>' +
                    '<div class="thumbnail-hover">' +
                    '<a id="deleteBoardFile">' +
                    '<i class="fa fa-fw fa-close pull-right" id="deleteFileThumb' + attachFileIndex + '" style="color: white;" ' +
                    'attachFileThumbNo="' + attachFileIndex + '" data-toggle="tooltip" data-original-title="Close"></i>' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $("#newPostModal").on("mouseenter", "#thumbnail" + attachFileIndex, function() {
                    var that = $(this).context.children[1];
                    $(that).css("opacity", "0.7");
                }).on("mouseleave", "#thumbnail" + attachFileIndex, function() {
                    var that = $(this).context.children[1];
                    $(that).css("opacity", "0");
                });

                $("#newPostModal").on("click", "#deleteFileThumb" + attachFileIndex, function() {
                    var attachFileThumbNo = $(this).attr("attachFileThumbNo");
                    $("#newPostModal #attachFileThumb" + attachFileThumbNo).fadeOut(500, function() {
                        $(this).remove();
                    });
                    attachFiles[attachFileThumbNo] = undefined;
                    attachFileCnt--;
                });

                $("#newPostModal #attachFileThumbDiv").append(attachFileThumb);
                attachFileIndex++;
            }
            attachFileCnt++;
            attachFiles.push(imageFile);
        } else {
            alert("Total image maximum file size for uploads is 10 MB.");
        }
    }
    return false;
}



/*board regist*/
$("#newPostModal #boardAddForm").submit(function() {
    var formData = new FormData();
    formData.append("writer", filterXSS($("#newPostModal #boardAddForm #writer").val()));
    formData.append("password", filterXSS($("#newPostModal #boardAddForm #password").val()));
    formData.append("title", filterXSS($("#newPostModal #boardAddForm #title").val()));
    formData.append("content", filterXSS($("#newPostModal #boardAddForm #content").val()));
    formData.append("grp", 0);
    formData.append("grpSeq", 1);
    formData.append("depth", 0);
    formData.append("isReply", filterXSS($("#newPostModal #boardAddForm #isReply").val()));

    Array.prototype.sort.call(attachFiles);
    for(var i = 0; i < attachFileCnt; i++) {
        formData.append("files[]", attachFiles[i]);
    }

    if(uploadFile(formData, board.contextRoot + "regist")) {
        alert("Success regist new post");
        $("#newPostModal button.close").trigger("click");
        getList();
    }
    return false;
});

function uploadFile(formData, url) {
    var isNotERR = true;
    $.ajax({
        url : url,
        data : formData,
        dataType : "text",
        processData : false,
        contentType : false,
        type : "post",
        success : function(data) {
            if(data) {
                alert("Error : " + data);
                isNotERR = false;
            }
        }
    });
    return isNotERR;
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////
/////////////////////////////////list/////////////////////////////////
//////////////////////////////////////////////////////////////////////
function getList() {
    $.getJSON(board.contextRoot + "getList?" + $.param(board.pageable), function(data) {
        console.log(data);
        var boardHTML = "";
        var boardList = data.board_list;
        for(var i in boardList) {
            var b = boardList[i];

            boardHTML += '<li class="list-group-item">';
            boardHTML += '	<div class="media">';
            for(var i = 0; i < b.depth; i++) {
                boardHTML += '		<i class="pull-left">&nbsp;&nbsp;</i>';
            }
            boardHTML += '		<i class="fa fa-file-o pull-left"></i>';
            boardHTML += '		<span class="number pull-right"># ' + b.b_no + '</span>';
            boardHTML += '		<div class="media-body">';
            if(b.depth != 0) {
                boardHTML += '			<div class="label label-primary">ㄴREPLY</div>';
            }
            boardHTML += '			<div class="title"><a class="board-detail-link" boardNo=' + b.b_no + ' data-toggle="modal" data-target="#detailPostModal">' + b.title + '</a></div>';
            boardHTML += '			<p class="info">' + b.writer;
            boardHTML += '				<strong> /</strong>';
            boardHTML += '				<i class="fa fa-fw fa-clock-o"></i>' + b.reg_date;
            boardHTML += '				<strong> /</strong>';
            boardHTML += '				<i class="fa fa-comments"></i> ' + b.comment_cnt + ' comments';
            boardHTML += '			</p>';
            boardHTML += '		</div>';
            boardHTML += '	</div>';
            boardHTML += '</li>';
        }
        $("#boardList").html(boardHTML);
        $("a.board-detail-link").click(clickBoardDetailLink);

        var paginationHTML = "";
        if(data.page_no != 1) {
            paginationHTML += '<li><a class="page-link" pageNo=1>&lt&lt</a></li>';
        }
        if(data.begin_page != 1){
            paginationHTML += '<li><a class="page-link" pageNo=' + (data.begin_page - 1) + '>&lt</li>'
        }
        for(var i = data.begin_page; i <= data.end_page; i++) {
            paginationHTML += '<li';
            if(i == data.page_no) {
                paginationHTML += ' class="active"'
            }
            paginationHTML += '><a class="page-link" pageNo=' + i + '>' + i + '</a></li>';
        }
        if(data.end_page != data.last_page) {
            paginationHTML += '<li><a class="page-link" pageNo=' + (data.end_page + 1) + '>&gt</a></li>';
        }
        if(data.page_no != data.last_page) {
            paginationHTML += '<li><a class="page-link" pageNo=' + data.last_page + '>&gt&gt</a></li>'
        }
        $(".board-list .pagination").html(paginationHTML);
        $("a.page-link").click(changePage);

        $(".board-list #searchType").html("FILTER BY");
        board.pageable.searchType = undefined;
        board.pageable.searchKeyword = undefined;
        board.pageable.pageNo = data.page_no;
        board.pageable.size = data.size;

    }).fail(function(e) {
        console.log(e);
    });
}
getList();

$(".board-list a.search-type").click(function(event) {
    event.preventDefault();
    var searchType = $(event.target).html();
    $(".board-list #searchType").html(searchType);
    board.pageable.searchType = searchType.toLowerCase();
});

$(".board-list #searchBtn").click(function() {
    board.pageable.searchKeyword = filterXSS($(".board-list input[name=keyword]").val());
    getList();
    $(".board-list input[name=keyword]").val("");
});

$(".board-list a.row-per-page").click(function(event) {
    event.preventDefault();

    var rows = parseInt($(this).html().split(" ")[0]);
    board.pageable.size = rows;
    $(".board-list #rowsPerPage").html(rows + " rows")
    getList();
});

function changePage(event) {
    event.preventDefault();
    board.pageable.pageNo = $(event.target).attr("pageNo");
    getList();
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
