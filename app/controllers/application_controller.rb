class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def receive
    data = request.raw_post
    image_prefix = 'data:image/png;base64,'
    if data.start_with? image_prefix
      data_without_prefix = data[image_prefix.length .. -1]
      image_data = Base64.decode64 data_without_prefix
      file = "tmp/video-#{DateTime.now.to_i}.png"
      file = File.new(file, 'wb')
      file.write image_data
    else
      file = "tmp/video-#{DateTime.now.to_i}.webm"
      File.open(file, 'w:ASCII-8BIT') { |file| file.write(data) }
    end
  end
end
