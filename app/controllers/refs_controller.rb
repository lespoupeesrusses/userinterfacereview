class RefsController < ApplicationController
  before_action :set_ref, only: [:show, :edit, :update, :destroy]

  def index
    @refs = Ref.ordered
    @search = params[:search]
    @refs = @refs.search(@search) unless @search.nil?
    @refs = @refs.page params[:page]
  end

  def show
  end

  def new
    @ref = Ref.new
  end

  def edit
  end

  def create
    @ref = Ref.new(ref_params)
    respond_to do |format|
      if @ref.save
        format.html { redirect_to @ref, notice: 'Ref was successfully created.' }
        format.json { render :show, status: :created, location: @ref }
      else
        format.html { render :new }
        format.json { render json: @ref.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @ref.update(ref_params)
        format.html { redirect_to @ref, notice: 'Ref was successfully updated.' }
        format.json { render :show, status: :ok, location: @ref }
      else
        format.html { render :edit }
        format.json { render json: @ref.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @ref.destroy
    respond_to do |format|
      format.html { redirect_to refs_url, notice: 'Ref was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def set_ref
      @ref = Ref.find(params[:id])
    end

    def ref_params
      params
        .require(:ref).permit(:title, :description, :keywords, :url, :image, :video)
        .merge(user_id: current_user.id)
    end
end
