class NestedContactSerializer < ActiveModel::Serializer
  attributes :id,
  :photo,
  :prefix,
  :full_name,
  :first_name,
  :last_name,
  :phone_number,
  :work_email

  def full_name
    if object.first_name
      if object.last_name
        "#{object.first_name} #{object.last_name}"
      else
        "#{object.first_name}"
      end
    else
      if object.last_name
        "#{object.last_name}"
      end
    end
  end

end
