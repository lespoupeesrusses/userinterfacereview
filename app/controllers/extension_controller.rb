class ExtensionController < ApplicationController
  skip_before_action :verify_authenticity_token

  def hello
    render json: { user: "#{current_user}" }
  end

  def receive
    return unless current_user
    @ref = Ref.new  user: current_user,
                    title: params[:title],
                    url: params[:url],
                    description: params[:description],
                    keywords: params[:keywords]
    data = request.raw_post
    image_prefix = 'data:image/png;base64,'
    if data.start_with? image_prefix
      data_without_prefix = data[image_prefix.length .. -1]
      image_data = Base64.decode64 data_without_prefix
      io = StringIO.new image_data
      @ref.image.attach(io: io, filename: "screenshot.png", content_type: "image/png")
    else
      io = StringIO.new data, 'rb'
      @ref.video.attach(io: io, filename: "screencast.webm", content_type: "video/webm")
    end
    @ref.save
  end
end