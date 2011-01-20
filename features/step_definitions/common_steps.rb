When /^I wait for (\d+) second$/ do |n|
  sleep(n.to_i)
end

When /^I reload the page$/ do
  When %Q{I go to the home page}
  And %Q{I wait for ajax call complete}
end

Given /^I wait for ajax call complete$/ do
  timeout = 10
  wait_until(timeout) do
    ajax_in_progress = Capybara.current_session.evaluate_script <<-JS
      Rwiki.ajaxCallInProgress;
    JS

    !ajax_in_progress
  end
end

Then /^I should see dialog box titled "([^"]*)"$/ do |title|
  %Q{Then I should see "#{title}" within "span.x-window-header-text"}
end

When /^I fill in the dialog box input with "([^"]*)"$/ do |text|
  field = find("div.x-window-dlg input")
  field.set(text)
end
