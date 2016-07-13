<?php

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

}