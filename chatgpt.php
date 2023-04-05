<?php
/**
 * Plugin Name: ChatGpt
 * Description: Use ChatGPT to generate posts
 * Version: 0.0.1
 * Author: Maksym
 **/

add_action('enqueue_block_assets', function() {
  wp_enqueue_script(
    'chatgpt',
    trailingslashit(plugin_dir_url(__FILE__)) . 'js/chatgpt.js',
    ['wp-api-fetch', 'wp-blocks', 'wp-components', 'wp-data', 'wp-edit-post', 'wp-element', 'wp-plugins', 'wp-polyfill'],
    '0.0.1'
  );
});

add_action( 'rest_api_init', 'testtest');
function testtest() {
  register_rest_route( 'chatgpt/v1', 'getresponse', array(
    'methods' => 'POST',
    'callback' => 'send_chatgpt_request',
  ));
}
function send_chatgpt_request(WP_REST_Request $request) {
  
  $apiKey = "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";
  $url = 'https://api.openai.com/v1/chat/completions';

  $headers = array(
    "Authorization: Bearer {$apiKey}",
    "OpenAI-Organization: org-G9CHDlgWCgkKzC5eM8KXVULF",
    "Content-Type: application/json"
  );

// Define messages
  $messages = array();
  $messages[] = array("role" => "user", "content" => $request->get_param('message'));

// Define data
  $data = array();
  $data["model"] = "gpt-3.5-turbo";
  $data["messages"] = $messages;
  $data["max_tokens"] = 500;

// init curl
  $curl = curl_init($url);
  curl_setopt($curl, CURLOPT_POST, 1);
  curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
  curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

  $result = curl_exec($curl);
  if (curl_errno($curl)) {
    echo 'Error:' . curl_error($curl);
  } else {
    echo $result;
  }

  curl_close($curl);
}
