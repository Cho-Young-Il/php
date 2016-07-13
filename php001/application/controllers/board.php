<?php
defined('BASEPATH') OR exit('No direct script access allowed');
date_default_timezone_set("Asia/Seoul");

class Board extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->model('board_model');
		$this->load->model('attachfile_model');
		$this->load->model('comment_model');
	}

	public function index() {
		$this->load->view('board');
	}

	public function regist() {
		//board, file regist
		//password one way hash(bcrypt)
		//insert transaction
		$this->db->trans_begin();

		$b_no = $this->boardRegist();	//board regist, password one way hash(bcrypt)
		if(!empty($_FILES)) {			//file regist when file exist
			if($this->fileRegist($b_no)) {
				log_message("error", "ERROR file regist");
				$this->db->trans_rollback();
				echo "Can not exceed maximum upload size";
			};
		}

		if($this->db->trans_status() === false) {
			log_message("error", "ERROR board regist controller");
			$this->db->trans_rollback();
			echo "Fail to register board";
		}

		$this->db->trans_commit();
	}

	public function getList() {
		//get board list, paging, search condition

		$howmany_per_page = $_GET['size'];
		$PAGE_UNIT = 5;

		$page_no = $_GET['pageNo'];
		$start = ($page_no - 1) * $howmany_per_page + 1;

		$ret = $this->board_model->getList(array(
			'start'=>$start,
			'howmany_per_page'=>$howmany_per_page,
			'search_type'=>$_GET['searchType'],
			'search_keyword'=>$_GET['searchKeyword'],
		));

		$board_cnt_all = $ret['board_cnt_all'];
		$last_page = ($board_cnt_all % $howmany_per_page == 0) ?
					intval($board_cnt_all / $howmany_per_page) :
					intval($board_cnt_all / $howmany_per_page) + 1;
		log_message("info", gettype($last_page));
		$current_tab = intval(($page_no - 1) / $PAGE_UNIT) + 1;
		$begin_page = ($current_tab - 1) * $PAGE_UNIT + 1;
		$end_page = ($current_tab * $PAGE_UNIT > $last_page) ?
					$last_page : $current_tab * $PAGE_UNIT;

		$json['board_list'] = $ret['board_list'];
		$json['page_no'] = $page_no;
		$json['last_page'] = $last_page;
		$json['begin_page'] = $begin_page;
		$json['end_page'] = $end_page;
		$json['size'] = $howmany_per_page;

		echo json_encode($json);
	}

	public function detail() {
		//get board detail(board, comment list, file list)

		$board = $this->board_model->detail($_GET['b_no']);
		$comment_list = $this->comment_model->getList($_GET['b_no']);
		$file_list = $this->attachfile_model->getList($_GET['b_no']);

		$json['board'] = $board;
		$json['comment_list'] = $comment_list;
		$json['file_list'] = $file_list;

		echo json_encode($json);
	}

	public function update() {
		$update = $this->board_model->update(array(
			'b_no'=>$_POST['b_no'],
			'title'=>$_POST['title'],
			'content'=>$_POST['content']
		));
		if($update) echo true;
		else echo false;
	}

	public function delete_file() {
		//attachfile db delete with f_no
		$delete_file = $this->attachfile_model->delete_file($_POST['f_no']);
		if($delete_file) { //file delete if exist
			$saved_dir = $_POST['saved_dir'];
			if(file_exists($saved_dir)) {
				unlink($saved_dir);
			}
			echo true;
		} else {
			echo false;
		}
	}

	public function delete() {
		$b_no = $_POST['b_no'];

		$this->db->trans_start();

		$this->comment_model->delete($b_no);

		$file_list = $this->attachfile_model->getList($b_no);
		$length = count($file_list);
		for($i = 0; $i < $length; $i++) {
			$saved_dir = $file_list[$i]['saved_dir'];
			if(file_exists($saved_dir)) {
				unlink($saved_dir);
			}
		}

		$this->attachfile_model->delete($b_no);
		$this->board_model->delete($b_no);

		$this->db->trans_complete();

		if ($this->db->trans_status() === FALSE) {
			echo false;
		} else {
			echo true;
		}
	}

	public function check_pwd() {
		//compare hash with password
		$hash = $this->board_model->get_board_pwd($_POST['b_no']);
		if(password_verify($_POST['pwd'], $hash)) {
			echo true;
		} else {
			echo false;
		}
	}

	private function boardRegist() {
		//board register, password one way hash(bcrypt)
		$b_no = $this->board_model->regist(array(
			'grp'=>$_POST['grp'],
			'grp_seq'=>$_POST['grpSeq'],
			'depth'=>$_POST['depth'],
			'writer'=>$_POST['writer'],
			'password'=>password_hash($_POST['password'], PASSWORD_BCRYPT),
			'title'=>$_POST['title'],
			'content'=>$_POST['content']
		));

		if($_POST['grp'] == 0) {
			$this->board_model->update_grp($b_no);
		}

		return $b_no;
	}

	private function fileRegist($b_no) {
		//file register

		if(is_array($_FILES['files']['name'])) {
			$pattern = "/.(jpeg|jpg|gif|png)$/i";
			$filesize = 0;

			foreach($_FILES['files']['size'] as $key => $val) {
				if($_FILES['files']['size'][$key] > 0) {
					$filesize += $_FILES['files']['size'][$key];
				}
			}

			if(!$filesize > 10485760) {
				return false;
			} else {
				foreach($_FILES['files']['name'] as $key => $val) {
					if($_FILES['files']['size'][$key] > 0) {
						if($_FILES['files']['error'][$key] === UPLOAD_ERR_OK) {
							if(is_uploaded_file($_FILES['files']['tmp_name'][$key])
								&& preg_match($pattern, $_FILES['files']['name'][$key], $matches)) {

								$date_format = (new DateTime())->format('Y/m/d');

								$ori_name = str_replace(" ", "_", $_FILES['files']['name'][$key]);
								$real_name = uniqid()."_".$ori_name;
								$saved_dir = "public/upload/".$date_format."/".$real_name;

								$dir = "public/upload/".$date_format;
								if(!is_dir($dir)) {
									mkdir($dir, 0755, true);
								}

								$tmp_name = $_FILES['files']['tmp_name'][$key];
								if(move_uploaded_file($tmp_name, $dir."/".$real_name)) {
									//DB Attachfile insert with board NO
									$this->attachfile_model->regist(array(
										'b_no'=>$b_no,
										'ori_name'=>$ori_name,
										'real_name'=>$real_name,
										'saved_dir'=>$saved_dir,
									));
								}
							}
						}
					}
				}
			}
		}
	}

}
