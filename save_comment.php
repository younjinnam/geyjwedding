<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['comment'])) {
    $comment = strip_tags($_POST['comment']);
    file_put_contents('comments.txt', $comment . PHP_EOL, FILE_APPEND);
}
?>
