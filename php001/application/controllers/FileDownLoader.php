<?php
defined('BASEPATH') OR exit('No direct script access allowed');
date_default_timezone_set("Asia/Seoul");

class FileDownLoader extends CI_Controller{

    public function down() {
        $ori_name = $_GET['ori_name'];
        $saved_dir = $_GET['saved_dir'];

        Header("Content-Type: application/octet-stream");
        Header("Content-Disposition: attachment; filename=".$ori_name);
        Header("Content-Length: " . filesize($saved_dir));
        header("Content-Transfer-Encoding: binary ");
        Header("Pragma: no-cache");
        Header("Expires: 0");
        flush();

        $fp = fopen($saved_dir, "rb");
        if(!fpassthru($fp)) fclose($fp);
    }

}
