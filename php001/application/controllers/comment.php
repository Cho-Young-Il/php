<?php
defined('BASEPATH') OR exit('No direct script access allowed');
date_default_timezone_set("Asia/Seoul");

class Comment extends CI_Controller{

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->model('comment_model');
    }

    public function regist() {
        $b_no = $_POST['b_no'];
        $this->comment_model->regist(array(
            'b_no'=>$b_no,
            'writer'=>$_POST['writer'],
            'password'=>password_hash($_POST['password'], PASSWORD_BCRYPT),
            'content'=>$_POST['content']
        ));
        $json['comment_list'] = $this->comment_model->getList($b_no);
        echo json_encode($json);
    }

    public function delete() {
        $c_no = $_POST['c_no'];
        $hash = $this->comment_model->get_comment_pwd($c_no);
        if(password_verify($_POST['pwd'], $hash)) {
            $this->comment_model->delete($c_no);
            $json['success'] = true;
            $json['comment_list'] = $this->comment_model->getList($_POST['b_no']);
            echo json_encode($json);
        } else {
            $json['success'] = false;
            echo json_encode($json);
        }
    }

}
