class Employee < ApplicationRecord
  belongs_to :contact
  has_many :event_employees, dependent: :destroy
  has_many :events, through: :event_employees
end