<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="/public/lib/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="/public/lib/font-awesome/css/font-awesome.min.css">
<link rel="stylesheet" href="/public/lib/clean-blog/css/clean-blog.min.css">
<link rel="stylesheet" href="/public/css/header.css">
<link rel="stylesheet" href="/public/css/board.css">
<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic">
<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800">
<title>PHP001</title>
</head>
<body>

<?php include "header.php";?>

<!-- List Contents -->
<div class="container board-list">
<section class="content">
	<div class="row">
		<div class="col-md-10 col-md-offset-1">
			<div class="grid support-content">
				 <div class="grid-body">
					<br><br>
					<div class="row">
						<div class="col-md-8 col-md-offset-2">
							<div class="input-group">
				                <div class="input-group-btn search-panel">
				                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
				                    	<span id="searchType">Filter by</span> <span class="caret"></span>
				                    </button>
				                    <ul class="dropdown-menu" role="menu">
				                      <li><a class="search-type">Title</a></li>
				                      <li><a class="search-type">Content</a></li>
				                      <li><a class="search-type">Writer</a></li>
				                      <li class="divider"></li>
				                      <li><a class="search-type">Anything</a></li>
				                    </ul>
				                </div>
				                <input type="text" class="form-control" name="keyword" placeholder="Search">
				                <span class="input-group-btn">
				                    <button class="btn btn-primary" id="searchBtn" type="button"><span class="glyphicon glyphicon-search"></span></button>
				                </span>
				            </div>
						</div><br>
						<div class="col-md-12"><hr>
							<ul id="boardList" class="list-group fa-padding" style="word-break: break-all;"></ul>
						<hr></div>

						<div class="col-md-12">
							<div class="btn-group btn-group-sm dropup pull-left">
								<a class="btn btn-default dropdown-toggle" data-toggle="dropdown"
									aria-haspopup="true" aria-expanded="false"><strong>Show rows per page</strong>
									<span class="fa fa-caret-up"></span>
								</a>
								<ul class="dropdown-menu" role="menu">
									<li><a class="text-center row-per-page">10 rows</a></li>
									<li><a class="text-center row-per-page">20 rows</a></li>
									<li><a class="text-center row-per-page">40 rows</a></li>
									<li><a class="text-center row-per-page">60 rows</a></li>
									<li><a class="text-center row-per-page">80 rows</a></li>
									<li><a class="text-center row-per-page">100 rows</a></li>
								</ul>
							</div>
							<span id="rowsPerPage" style="margin-left: 10px; color: #337ab7; font-size:22px; font-weight: bold;">10 rows</span>
							<ul class="pagination pagination-sm pull-right" style="margin: 0 0; font-weight: bold;"></ul>
						</div>
					</div><br><br><br>
				</div>
			</div>
		</div>
	</div>
</section>
</div><br>
<div id="goTop" class="col-md-12" style="width: 100%; margin:0px; padding:0px;">
	<a class="btn btn-block btn-link go-top">
	<i class="fa fa-chevron-up fa-fw text-danger"></i></a>
</div>

<!-- NEW POST MODAL -->
<div class="modal fade file-drop" id="newPostModal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="file-drag"></div>
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">×</button>
				<h1 class="modal-title text-center">
					<i class="fa fa-fw fa-pencil"></i>NEW POST
				</h1>
			</div>
			<div class="modal-body col-sm-10 col-sm-offset-1">
				<form class="form-horizontal" id="boardAddForm" role="form" enctype="multipart/form-data">
					<div class="form-group">
						<div class="col-sm-3 text-right" style="font-size: 12px;">
							<label class="control-label">
								<i class="fa fa-fw fa-lg fa-user"></i>NICKNAME
							</label>
						</div>
						<div class="col-sm-9">
							<input type="text" class="form-control" id="writer"
								   maxlength="50" required="required" placeholder="NICKNAME">
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-3 text-right" style="font-size: 12px;">
							<label class="control-label">
								<i class="fa fa-fw fa-lg fa-lock"></i>PASSWORD
							</label>
						</div>
						<div class="col-sm-9">
							<input type="password" class="form-control" id="password"
								   maxlength="50" pattern=".{4,}" title="At least 4 characters"
								   required="required" placeholder="PASSWORD">
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-3 text-right" style="font-size: 12px;">
							<label for="title" class="control-label"> <i
									class="fa fa-fw fa-lg fa-magic"></i>TITLE
							</label>
						</div>
						<div class="col-sm-9">
							<input type="text" class="form-control" id="title"
								   name="title" maxlength="50" required="required" placeholder="TITLE">
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-3 text-right">
							<label class="control-label" style="font-size: 12px;"> <i
									class="fa fa-fw fa-lg fa-align-right"></i>CONTENT
							</label>
						</div>
						<div class="col-sm-9">
							<textarea id="content" class="form-control" required="required" placeholder="CONTENT"></textarea>
							<h6 class="pull-right" id="cntMsg" style="font-weight: 700; color: #31708f;">200 remaining</h6>
						</div>
					</div>

					<input id="attachFiles" type="file" multiple="multiple" style="display: none;">
					<button id="searchImage" class="btn btn-block btn-danger">
						<i class="fa fa-fw fa-file-picture-o"></i>SEARCH IMAGE
					</button><hr>

					<div id="attachFileThumbDiv" class="row"></div>

					<div class="panel panel-default">
						<div class="panel-heading">
							<p class="panel-title">Upload Note</p>
						</div>
						<div class="panel-body" style="font-size: 13px;">
							<ul>
								<li>The maximum file size for uploads is <strong>10 MB</strong>.</li>
								<li>Only image files (<strong>JPG, JPEG, GIF, PNG</strong>) are allowed.</li>
								<li>You can <strong>drag &amp; drop</strong> files from your desktop on this window.</li>
							</ul>
						</div>
					</div><hr>
					<div style="float:right;">
						<button class="btn btn-default" data-dismiss="modal">CLOSE</button>
						<button class="btn btn-primary" type="submit">
							<i class="fa fa-fw fa-floppy-o"></i>REGIST
						</button>
					</div>
				</form>
			</div>
			<div class="modal-footer" style="border: 0px;"></div>
		</div>
	</div>
</div>


<!-- DETAIL POST MODAL -->
<div class="modal fade" id="detailPostModal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">×
				</button>
				<h1 class="modal-title text-center">
					<i class="fa fa-fw fa-pencil"></i>POST DETAIL
				</h1>
			</div>
			<div class="modal-body col-sm-10 col-sm-offset-1">
				<form class="form-horizontal" id="boardDetailForm" role="form">
					<input type="hidden" id="bNo">
					<input type="hidden" id="depth">
					<input type="hidden" id="grp">
					<input type="hidden" id="grpSeq">
					<div class="form-group">
						<div class="col-sm-3 text-right" style="font-size: 12px;">
							<label class="control-label">
								<i class="fa fa-fw fa-lg fa-magic"></i>TITLE
							</label>
						</div>
						<div class="col-sm-9">
							<input type="text" id="editTitle" class="form-control" maxlength="50"
								   required="required" readonly="true">
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-3 text-right" style="font-size: 12px;">
							<label class="control-label">
								<i class="fa fa-fw fa-lg fa-align-right"></i>CONTENT
							</label>
						</div>
						<div class="col-sm-9">
                            <textarea id="editContent" class="form-control" required="required"
									  rows="7" readonly="true"></textarea>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-3 text-right" style="font-size: 12px;">
							<label class="control-label">
								<i class="fa fa-fw fa-file-image-o"></i>FILE
							</label>
						</div>
						<div class="col-sm-9">
							<div id="fileListDiv"
								 style="border: 1px darkgray solid; border-radius: 5px; font-size: 14px;
								  		font-weight: bold; padding: 15px;">
							</div>
						</div>
					</div>
					<div class="form-group" id="boardPwdDiv">
						<div class="col-sm-3 text-right" style="font-size: 12px;">
							<label class="control-label">
								<i class="fa fa-fw fa-lg fa-lock"></i>PASSWORD
							</label>
						</div>
						<div class="col-sm-9">
							<input type="password" id="checkPWD" class="form-control" maxlength="50"
								   required="required" placeholder="PASSWORD">
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12" style="font-size: 14px;">
							<label class="col-sm-8 control-label">
								<i class="fa fa-fw fa-lg fa-user"></i>NICKNAME :
							</label>
							<label class="col-sm-4 control-label">
								<i class="text-left" id="nickName"></i>
							</label>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12" style="font-size: 14px;">
							<label class="col-sm-8 control-label">
								<i class="fa fa-fw fa-clock-o"></i>POSTED DATE :
							</label>
							<label class="col-sm-4 control-label">
								<i id="postDate"></i>
							</label>
						</div>
					</div><hr>
					<div style="float:right;">
						<button id="detailCloseBtn" class="btn btn-default" data-dismiss="modal">CLOSE</button>
						<button class="btn btn-success" type="button" id="editBtn">
							<i class="fa fa-fw fa-edit"></i>EDIT
						</button>
						<button class="btn btn-primary" type="button" id="replyBtn" data-toggle="modal" data-target="#newPostModal">
							<i class="fa fa-fw fa-reply"></i>REPLY
						</button>
						<button class="btn btn-success" type="button" id="modifyBtn" style="display: none;">
							<i class="fa fa-fw fa-floppy-o"></i>MODIFY
						</button>
						<button class="btn btn-danger" type="button" id="deleteBtn"
								style="display: none;">
							<i class="fa fa-fw fa-trash"></i>DELETE
						</button>
					</div>
				</form><br><br>
				<div class="row" style="margin-bottom: 10px;" id="commentDiv">
					<div class="col-md-10 col-md-offset-1"><hr>
						<h5 style="text-align: center" class="text-primary">NEW COMMENT</h5>
						<form class="form-horizontal" id="commentAddForm" role="form">
							<div class="input-group">
								<input type="text" class="form-control" name="content" placeholder="Comment">
								<span class="input-group-btn">
									<button class="btn btn-primary" id="commentAddBtn" type="submit"
											style="padding: 7.5px 10px; font-size: 12.5px;">
										<span class="glyphicon glyphicon-comment"></span>
									</button>
								</span>
							</div>
							<div id="commentAddFormDiv" style="display: none;">
								<div class="form-group">
									<br>
									<div class="col-sm-3 text-right" style="font-size: 10px;">
										<label class="control-label">
											<i class="fa fa-fw fa-lg fa-user"></i>NICKNAME
										</label>
									</div>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="writer"
											   maxlength="50" required="required" placeholder="NICKNAME">
									</div>
								</div>
								<div class="form-group">
									<div class="col-sm-3 text-right" style="font-size: 10px;">
										<label class="control-label">
											<i class="fa fa-fw fa-lg fa-lock"></i>PASSWORD
										</label>
									</div>
									<div class="col-sm-9">
										<input type="password" class="form-control" id="password"
											   maxlength="50" pattern=".{4,}" title="At least 4 characters"
											   required="required" placeholder="PASSWORD">
									</div>
								</div>
							</div>
						</form><hr>
						<div id="commentList"></div>
					</div><br>
				</div><hr>
			</div>
			<div class="modal-footer" style="border: 0px;"></div>
		</div>
	</div>
</div>

<!-- FILE DELETE CONFIRM -->
<div class="modal fade" id="fileDeleteConfirm">
	<div class="modal-dialog modal-sm">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">×</button>
				<h4 class="modal-title text-danger">Delete File</h4>
			</div>
			<form id="deleteFileForm" role="form">
				<input type="hidden" id="deleteFileNo">
				<input type="hidden" id="savedDir">
				<div class="modal-body">
					<h5>Delete this file?</h5>
				</div>
				<div class="modal-footer">
					<button class="btn btn-default" data-dismiss="modal">Cancle</button>
					<button class="btn btn-danger" id="deleteFileBtn"><i class="fa fa-fw fa-trash"></i>Delete</button>
				</div>
			</form>
		</div>
	</div>
</div>


<?php include 'footer.php';?>

<script src="/public/lib/jquery/jquery.min.js"></script>
<script src="/public/lib/jquery-ui/ui/minified/jquery-ui.min.js"></script>
<script src="/public/lib/bootstrap/js/bootstrap.min.js"></script>
<script src="/public/lib/autogrow-textarea/jquery.autogrowtextarea.min.js"></script>
<script src="/public/lib/jquery-smooth-scroll/jquery.smooth-scroll.min.js"></script>
<script src="/public/lib/xss/xss.min.js"></script>
<script src="/public/js/header.js"></script>
<script src="/public/js/board.js"></script>
</body>
</html>
