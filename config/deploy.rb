# config valid only for current version of Capistrano
lock '3.4.0'

# set :application, 'my_app_name'
set :application, 'ufmg.br'
set :repo_url, 'file:///usr/local/repos/cms.bare'
set :branch, 'deploy'
set :deploy_to, '/usr/local/www/portal-ufmg/cms'
#set :scm, :git
set :format, :pretty
set :pty, true
# set :linked_files, fetch(:linked_files, []).push('app/autoload.php', 'composer')
# set :linked_files, fetch(:linked_files, []).push('composer')
set :linked_dirs, fetch(:linked_dirs, []).push('build')
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5

namespace :deploy do
	
	before :starting, :prepare
	before :starting, :compile

	# after :starting, 'composer:install_executable'

	task :prepare do
		desc "Create server directories"
		on roles(:all) do
			execute "mkdir -p /usr/local/www/portal-ufmg/cms/shared/{build}"
		end
	end


	task :compile do
		desc "Compila scripts e envia via RSYNC"
		run_locally do
			execute "npm install"
			#execute "bower install"
			execute "gulp build --env prod"
            #execute "APPLICATION_ENV=prod gulp --color --gulpfile gulpfile.js build"
            roles(:all).each do |host|
				#execute "rsync -CRravzp -e 'ssh -p 22' ./bower_components/ user_cedecom@#{host}:/usr/local/www/portal-ufmg/cms/shared/bower_components/"
				#execute "rsync -CRravzp -e 'ssh -p 22' ./node_modules/ user_cedecom@#{host}:/usr/local/www/portal-ufmg/cms/shared/node_modules/"
				execute "rsync -CRravzp -e 'ssh -p 22' ./build/ user_cedecom@#{host}:/usr/local/www/portal-ufmg/cms/shared"
			end
		end
	end
end

# Rake::Task['deploy:updated'].prerequisites.delete('composer:install')

# SSHKit.config.command_map[:composer] = "php #{shared_path.join("composer")}"


#namespace :deploy do
#
#  task :gulp do
#    within "/opt/portalUFMG/portal/cms/current/"
#    as :portalUFMG do
#      execute 'gulp build --env staging'
#    end
#  end

#  after :restart, :clear_cache do
#    on roles(:web), in: :groups, limit: 3, wait: 10 do
#      # Here we can do anything such as:
#      # within release_path do
#      #   execute :rake, 'cache:clear'
#      # end
#    end
#  end
#end
