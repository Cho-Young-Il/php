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
    contextRoot : "/~MacintoshHD/php001/index.php",
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
    board.ele.grp = 0;
    board.ele.grpSeq = 1;
    board.ele.depth = 0;
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
    formData.append("grp", board.ele.grp);
    formData.append("grpSeq", board.ele.grpSeq);
    formData.append("depth", board.ele.depth);
    formData.append("isReply", filterXSS($("#newPostModal #boardAddForm #isReply").val()));

    Array.prototype.sort.call(attachFiles);
    for(var i = 0; i < attachFileCnt; i++) {
        formData.append("files[]", attachFiles[i]);
    }

    if(uploadFile(formData, board.contextRoot + "/board/regist")) {
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

$("#detailPostModal #boardDetailForm #replyBtn").click(function() {
    $("#detailPostModal button.close").trigger("click");
    board.ele.depth = parseInt($("#detailPostModal #depth").val()) + 1;
    board.ele.grp = $("#detailPostModal #grp").val();
    board.ele.grpSeq = parseInt($("#detailPostModal #grpSeq").val()) + 1;

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

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////
/////////////////////////////////list/////////////////////////////////
//////////////////////////////////////////////////////////////////////
function getList() {
    $.getJSON(board.contextRoot + "/board/getList?" + $.param(board.pageable), function(data) {
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





//////////////////////////////////////////////////////////////////////
///////////////////////////////detail/////////////////////////////////
//////////////////////////////////////////////////////////////////////
function clickBoardDetailLink(event) {
    event.preventDefault();

    $("#detailPostModal #boardDetailForm #editTitle").attr("readonly", true);
    $("#detailPostModal #boardDetailForm #editContent").attr("readonly", true);
    $("#detailPostModal #commentAddFormDiv").fadeOut(10);
    $("#detailPostModal #commentAddFormDiv #writer").val("");
    $("#detailPostModal #commentAddFormDiv #password").val("");
    $("#detailPostModal #boardDetailForm #checkPWD").val("");
    $("#detailPostModal input[name=comment]").val("");
    $("#detailPostModal #commentDiv").css({"display":"block"});
    $("#detailPostModal #boardDetailForm .download").css({"display":"none"});
    $("#detailPostModal #boardDetailForm .deletefile").css({"display":"inline"});
    $("#detailPostModal #boardDetailForm #boardPwdDiv").css({"display":"block"});
    $("#detailPostModal #boardDetailForm #editBtn").css({"display": "inline"});
    $("#detailPostModal #boardDetailForm #replyBtn").css({"display": "inline"});
    $("#detailPostModal #boardDetailForm #modifyBtn").css({"display": "none"});
    $("#detailPostModal #boardDetailForm #deleteBtn").css({"display": "none"});

    $.getJSON(board.contextRoot + "/board/detail?b_no=" + $(event.target).attr("boardNo"), function(data) {
        var b = data.board[0];
        $("#detailPostModal #bNo").val(b.b_no);
        $("#detailPostModal #depth").val(b.depth);
        $("#detailPostModal #grp").val(b.grp);
        $("#detailPostModal #grpSeq").val(b.grp_seq);
        $("#detailPostModal #editTitle").val(b.title);
        $("#detailPostModal #editContent").val(b.content);
        $("#detailPostModal #nickName").html(b.writer);
        $("#detailPostModal #postDate").html(b.reg_date);

        var commentList = data.comment_list;
        var commentHTML = '<h5 style="text-align: center;">' + commentList.length + ' COMMENTS</h5>';
        for(var i in commentList) {
            var c = commentList[i];
            commentHTML += '<ul class="list-unstyled list-inline media-detail pull-left" style="font-size: 12px; font-weight: bold;">'
            commentHTML += '<li>' + c.writer + '</li>'
            commentHTML += '<li><i class="fa fa-calendar"></i> ' + c.reg_date + '</li>'
            commentHTML += '</ul><br>'
            commentHTML += '<div style="font-size: 12px; font-weight: bold;">' + c.content + '</div><hr>'
        }
        $("#detailPostModal #commentList").html(commentHTML);

        var fileHTML = "";
        var fileList = data.file_list;
        if(fileList.length == 0) {
            fileHTML = "NONE Attached files";
        }
        for(var i in fileList) {
            var f = fileList[i];

            var downURI = board.contextRoot + "/filedownloader/down?ori_name="
                        + f.ori_name + "&saved_dir=" + f.saved_dir;
            fileHTML += '<div style="font-size: 15px;width:180px; word-wrap: break-word; margin-bottom: 5px; margin-bottom: 5px;">'
            fileHTML += '<a style="width:180px; text-decoration: none; cursor: default;">' + f.ori_name + '</a>'
            fileHTML += '<a href="' + downURI + '" type="button" class="btn btn-success download" style="text-align:right;padding: 2px 10px; font-size: 12px; position: absolute; right: 30px;"><i class="fa fa-fw fa-download"></i>DOWN</a>'
            fileHTML += '<a type="button" class="btn btn-danger deletefile" data-toggle="modal" data-target="#fileDeleteConfirm" fileNo="' + f.f_no + '" savedDir="' + f.saved_dir + '" style="text-align:right;padding: 2px 10px; font-size: 12px; position: absolute; right: 30px; display: none;"><i class="fa fa-fw fa-trash"></i>DELETE</a>'
            fileHTML += '</div>'
        }

        $("#detailPostModal #fileListDiv").html(fileHTML);
        $("a.deletefile").click(deletefile);

    }).fail(function(e) {
        console.log(e);
    });
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////
///////////////////////////////update/////////////////////////////////
//////////////////////////////////////////////////////////////////////
$("#detailPostModal #boardDetailForm #editBtn").click(function() {
    $.post(board.contextRoot + "/board/check_pwd", {
        b_no : $("#detailPostModal #bNo").val(),
        pwd : filterXSS($("#detailPostModal #boardPwdDiv #checkPWD").val())
    }, function(data) {
        if(!data) {
            alert("Check password");
            var pwd = $("#detailPostModal #boardPwdDiv #checkPWD");
            pwd.val("");
            pwd.focus();
        } else {
            $("#detailPostModal #boardDetailForm #editTitle").attr("readonly", false);
            $("#detailPostModal #boardDetailForm #editContent").attr("readonly", false);
            $("#detailPostModal #boardDetailForm #checkPWD").val("");
            $("#detailPostModal #commentDiv").css({"display":"none"});
            $("#detailPostModal #boardDetailForm .download").css({"display":"none"});
            $("#detailPostModal #boardDetailForm .deletefile").css({"display":"inline"});
            $("#detailPostModal #boardDetailForm #boardPwdDiv").css({"display":"none"});
            $("#detailPostModal #boardDetailForm #editBtn").css({"display": "none"});
            $("#detailPostModal #boardDetailForm #replyBtn").css({"display": "none"});
            $("#detailPostModal #boardDetailForm #modifyBtn").css({"display": "inline"});
            $("#detailPostModal #boardDetailForm #deleteBtn").css({"display": "inline"});
        }
    }).fail(function(e) {
        console.log(e);
    });
});

$("#detailPostModal #boardDetailForm #modifyBtn").click(function() {
    var b_no = $("#detailPostModal #bNo").val();
    $.post(board.contextRoot + "/board/update", {
        b_no : b_no,
        title : filterXSS($("#detailPostModal #editTitle").val()),
        content : filterXSS($("#detailPostModal #editContent").val())
    }, function(data) {
        if(data) {
            alert("Update Success");
        } else {
            alert("Update Error");
        }
        $("#detailPostModal button.close").trigger("click");
    }).fail(function(e) {
        console.log(e);
    });
});

function deletefile(event) {
    event.preventDefault();
    $("#fileDeleteConfirm #deleteFileForm #deleteFileNo").val($(event.target).attr("fileNo"));
    $("#fileDeleteConfirm #deleteFileForm #savedDir").val($(event.target).attr("savedDir"));
}

$("#fileDeleteConfirm #deleteFileForm #deleteFileBtn").click(function() {
    var f_no = $("#fileDeleteConfirm #deleteFileForm #deleteFileNo").val();
    var saved_dir = $("#fileDeleteConfirm #deleteFileForm #savedDir").val();
    $.post(board.contextRoot + "/board/delete_file", {
        f_no : f_no,
        saved_dir : saved_dir
    }, function(data) {
        $("#fileDeleteConfirm button.close").trigger("click");
        if(data) {
            alert("Delete file success");
        } else {
            alert("Error delete file");
        }
        $("#detailPostModal button.close").trigger("click");
    }).fail(function(e) {
        console.log(e);
    });
    return false;
});
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////
///////////////////////////////delete/////////////////////////////////
//////////////////////////////////////////////////////////////////////
$("#detailPostModal #boardDetailForm #deleteBtn").click(function() {
    var b_no = $("#detailPostModal #bNo").val();
    $.post(board.contextRoot + "/board/delete", {
        b_no : b_no
    }, function(data) {
        if(data) {
            alert("Board Delete Success");
            getList();
        } else {
            alert("Error Delete Board");
        }
        $("#detailPostModal button.close").trigger("click");
    }).fail(function(e) {
        console.log(e);
    });
    return false;
});
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////
/////////////////////////comment register/////////////////////////////
//////////////////////////////////////////////////////////////////////
$("#detailPostModal input[name=content]").focus(function() {
    $("#detailPostModal #commentAddFormDiv").fadeIn(500);
});

$("#detailPostModal #commentAddForm").submit(function() {
    var b_no = $("#detailPostModal #bNo").val();
    $.post(board.contextRoot + "/comment/regist", {
        b_no : b_no,
        writer: filterXSS($("#detailPostModal #commentAddForm #writer").val()),
        password: filterXSS($("#detailPostModal #commentAddForm #password").val()),
        content: filterXSS($("#detailPostModal #commentAddForm input[name=content]").val())
    }, function(data) {
        $("#detailPostModal #commentAddFormDiv").fadeOut(10);
        $("#detailPostModal #commentAddForm #writer").val("");
        $("#detailPostModal #commentAddForm #password").val("");
        $("#detailPostModal #commentAddForm input[name=content]").val("");

        var commentList = data.comment_list;
        var commentHTML = '<h5 style="text-align: center;">' + commentList.length + ' COMMENTS</h5>';
        for(var i in commentList) {
            var c = commentList[i];
            commentHTML += '<ul class="list-unstyled list-inline media-detail pull-left" style="font-size: 12px; font-weight: bold;">'
            commentHTML += '<li>' + c.writer + '</li>'
            commentHTML += '<li><i class="fa fa-calendar"></i> ' + c.reg_date + '</li>'
            commentHTML += '</ul><br>'
            commentHTML += '<div style="font-size: 12px; font-weight: bold;">' + c.content + '</div><hr>'
        }
        $("#detailPostModal #commentList").html(commentHTML);

    }, "json").fail(function(e) {
        console.log(e);
    });
    //return false;
    return false;
});