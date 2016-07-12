<?php
defined('BASEPATH') OR exit('No direct script access allowed');
date_default_timezone_set("Asia/Seoul");

class Board extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->model('board_model');
		$this->load->model('attachfile_model');
	}

	public function index() {
		$this->load->view('board');
	}

	public function regist() {
		//board, file regist
		$this->db->trans_begin();

		$b_no = $this->boardRegist();	//board regist
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

	private function boardRegist() {
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
								$saved_dir = "/public/upload/".$date_format.$real_name;

								$dir = "public/upload/".$date_format;
								if(!is_dir($dir)) {
									mkdir($dir, 0755, true);
								}

								$tmp_name = $_FILES['files']['tmp_name'][$key];
								if(move_uploaded_file($tmp_name, $dir.$real_name)) {
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
