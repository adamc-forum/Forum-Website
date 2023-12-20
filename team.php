<?php

	/* Template Name: Team (Landing) */

		// Get fields
			$page = get_fields(281);
			
		// Get team
			global $url;
			
			$team = [];
			
			foreach (get_posts(['post_type'=>'team', 'posts_per_page'=>'-1']) as $team_member)
			{
				$team_member->fields = get_fields($team_member->ID);
				$team[$team_member->fields['content']['team']][] = $team_member;
				
				// Get queried team member
					if ($url[1] && $team_member->post_name == $url[1])
						$team_member_active = $team_member;
			}
			
			if (isset($_GET['advisory-board']))
				$team['advisory-board'] = $team['leadership'];

			
		// Meta
			global $meta;
				   $meta = ['title'			=> $page['meta'][0]['content']['title'],
				   			'description'	=> $page['meta'][0]['content']['description'],
							'image'			=> $page['meta'][0]['image'],
							'url'			=> '/team' . (isset($team_member_active) ? '/' . $team_member_active->post_name : false),
							'footer'		=> isset($team['advisory-board']) ? 'red' : 'grey'];
				
	/* Header */
		get_header();

?>

	<section id="team-member" smoothscroll="fixed" <?=$team_member_active ? 'active="true"' : false?>>
		<figure activate="reveal" scroll="reveal">
			<?php if ($team_member_active): ?>
				<img <?=srcset($team_member_active->fields['photo'], '1536x1536', false)?>
					 sizes="(min-width: 1023px) 39vw, 100vw"
					 alt="<?=$team_member_active->post_title?>" class="cover">
			<?php endif; ?>
		</figure>
		
		<button type="button" action="team-member.close" aria-label="Close Team Member"></button>
		
		<div class="container">
			<?php if ($team_member_active): ?>
				<h2 class="h2 text-reveal" activate="reveal"><?php foreach(explode(' ', $team_member_active->post_title) as $name): ?>
									<span><?=$name?></span>
								<?php endforeach; ?></h2>
				<p class="para md fade-up fade-up-para-lg" activate="reveal"><?=$team_member_active->fields['content']['role']?></p>
				<ul class="para sm fade-up fade-up-para-lg" activate="reveal">
					<?php if ($team_member_active->fields['content']['email']): ?>
						<li><a href="mailto:<?=$team_member_active->fields['content']['email']?>" class="email"><?=$team_member_active->fields['content']['email']?></a></li>
					<?php endif; ?>
					
					
					<?php if ($team_member_active->fields['content']['email']): ?>
						<li>
							<a href="<?=$team_member_active->fields['content']['linkedin']?>" class="linkedin">
								LinkedIn
									
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="-295 387 20 19" xml:space="preserve"><path d="M-287.8 390.7v1l6.6.3-9.4 9.7.6.7 9.4-9.7-.3 7.4h.9l.3-9.1-8.1-.3z"/></svg>
							</a>
						</li>
					<?php endif; ?>
				</ul>
				
				<p class="para lg fade-up" activate="reveal"><?=$team_member_active->fields['content']['headline']?></p>
				<p class="para sm pre fade-up fade-up-para-lg" activate="reveal"><?=$team_member_active->fields['content']['body']?></p>
			<?php endif; ?>
		</div>
	</section>
	
	<div class="bg-container" smoothscroll controller="team">
		<section id="team-hero" scroll="background" background="white" class="team-background">
			<div class="container">
				<strong class="heading margin fade-up" scroll="reveal">Our Team</strong>
				<h1 class="h1 pre button diagonal text-reveal" scroll="reveal"><?=$page['intro_section']['headline']?></h1>
				
				<div class="flex">
					<p class="para lg" scroll="reveal"><?=$page['intro_section']['content_blocks']['headline']?></p>
					<p class="para sm fade-up-para-lg" scroll="reveal"><?=$page['intro_section']['content_blocks']['body']?></p>
					<figure scroll="parallax">
						<img <?=srcset($page['intro_section']['image_1'], 'large')?>
							 sizes="(min-width: 1023px) 45vw, (min-width: 768px) 49vw, 80vw"
							 alt="Impact and Community" class="cover" scroll="image">
					</figure>
					<figure scroll="parallax">
						<img <?=srcset($page['intro_section']['image_2'], 'large')?>
							 sizes="(min-width: 1023px) 47vw, (min-width: 768px) 57vw, 80vw"
							 alt="Impact and Community" class="cover" scroll="image">
					</figure>
					
					<a href="/careers" class="button diagonal clickable text-reveal" scroll="reveal">
						<strong>See Career
								Opportunities
								With Forum</strong>
					</a>
				</div>
			</div>		
		</section>
			
		<section id="team-people" scroll="background" background="white" class="team-background">
			<strong class="big-text" scroll="scrolling-text">Our People</strong>
            <a href="#advisory-board">Advisory Board</a>
		</section>
		
		<section id="team-filters" scroll="background" background="white" class="team-background">
			<div class="container">
				<form class="filters fade-up fade-up-para-lg" scroll="reveal">		
					<label class="bullet">Select Team</label>
					<div>
						<div>
							<?php if ($team['leadership']): ?>
								<button type="button" class="para sm active" action="goto" target="leadership" aria-label="Go To Leadership">Leadership</button>
							<?php endif; ?>
							
							<?php if ($team['team-members']): ?>
								<button type="button" class="para sm" action="goto" target="team-members" aria-label="Go To Team Members">Team Members</button>
							<?php endif; ?>
							
							<?php if ($team['advisory-board']): ?>
								<button type="button" class="para sm" action="goto" target="advisory-board" aria-label="Go To Advisory Board">Advisory Board</button>
							<?php endif; ?>
						</div>
					</div>
				</form>
			</div>
		</section>
		
		<?php foreach (['leadership'=>'white', 'team-members'=>'burgundy', 'advisory-board'=>'white'] as $group => $background): ?>
			<?php if (!$team[$group]) continue; ?>
			
			<?php if (in_array($group, ['leadership', 'team-members'])): ?>
				<section class="team-members team-background" scroll="background" background="<?=$background?>" id="<?=$group?>">
					<div class="container">
						<h2 class="heading center fade-up" scroll="reveal"><?=ucwords(str_replace('-', ' ', $group))?></h2>
						<ul class="fade-up fade-up-para-lg" scroll="reveal">
							<?php foreach ($team[$group] as $key => $team_member): ?>
								<li slot="<?=$key % 3?>">
									<a href="/team/<?=$team_member->post_name?>" class="team-member no-smoothState" scroll="parallax.list">
										<figure>
											<img <?=srcset($team_member->fields['photo'], 'large')?>
												 sizes="(min-width: 1023px) 24vw, (min-width: 768px) 39vw, 44vw"
												 alt="<?=$team_member->post_title?>" class="cover" scroll="image">
											</figure>
										<p class="para smc pre"><strong><?=$team_member->post_title?></strong>
																<?=$team_member->fields['content']['role']?></p>
									</a>
									
									<div>
										<h2 class="h2 text-reveal" activate="reveal"><?php foreach(explode(' ', $team_member->post_title) as $name): ?>
															<span><?=$name?></span>
														<?php endforeach; ?></h2>
										
										<p class="para md fade-up fade-up-para-lg" activate="reveal"><?=$team_member->fields['content']['role']?></p>
										<ul class="para sm fade-up fade-up-para-lg" activate="reveal">
											<?php if ($team_member->fields['content']['email']): ?>
												<li><a href="mailto:<?=$team_member->fields['content']['email']?>" class="email"><?=$team_member->fields['content']['email']?></a></li>
											<?php endif; ?>
											
											
											<?php if ($team_member->fields['content']['email']): ?>
												<li>
													<a href="<?=$team_member->fields['content']['linkedin']?>" class="linkedin">
														LinkedIn
															
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="-295 387 20 19" xml:space="preserve"><path d="M-287.8 390.7v1l6.6.3-9.4 9.7.6.7 9.4-9.7-.3 7.4h.9l.3-9.1-8.1-.3z"/></svg>
													</a>
												</li>
											<?php endif; ?>
										</ul>
										
										<p class="para lg fade-up" activate="reveal"><?=$team_member->fields['content']['headline']?></p>
										<p class="para sm pre fade-up fade-up-para-lg" activate="reveal"><?=$team_member->fields['content']['body']?></p>
									</div>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				</section>
			<?php else: ?>
				<section class="team-members team-background" scroll="background" background="<?=$background?>" id="<?=$group?>">
					<div class="container">
						<h2 class="heading center fade-up" scroll="reveal"><?=ucwords(str_replace('-', ' ', $group))?></h2>
						<ul class="fade-up fade-up-para-lg" scroll="reveal">
							<?php foreach ($team[$group] as $key => $team_member): ?>
								<li>
									<a href="/team/<?=$team_member->post_name?>" class="team-member no-smoothState">
										<strong class="para lg"><?=$team_member->post_title?></strong>
										<p class="para smc"><?=$team_member->fields['content']['role']?></p>
									</a>
									
									<div>
										<h2 class="h2 text-reveal" activate="reveal"><?php foreach(explode(' ', $team_member->post_title) as $name): ?>
															<span><?=$name?></span>
														<?php endforeach; ?></h2>
										
										<p class="para md fade-up fade-up-para-lg" activate="reveal"><?=$team_member->fields['content']['role']?></p>
										<ul class="para sm fade-up fade-up-para-lg" activate="reveal">
											<?php if ($team_member->fields['content']['email']): ?>
												<li><a href="mailto:<?=$team_member->fields['content']['email']?>" class="email"><?=$team_member->fields['content']['email']?></a></li>
											<?php endif; ?>
											
											
											<?php if ($team_member->fields['content']['email']): ?>
												<li>
													<a href="<?=$team_member->fields['content']['linkedin']?>" class="linkedin">
														LinkedIn
															
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="-295 387 20 19" xml:space="preserve"><path d="M-287.8 390.7v1l6.6.3-9.4 9.7.6.7 9.4-9.7-.3 7.4h.9l.3-9.1-8.1-.3z"/></svg>
													</a>
												</li>
											<?php endif; ?>
										</ul>
										
										<p class="para lg fade-up" activate="reveal"><?=$team_member->fields['content']['headline']?></p>
										<p class="para sm pre fade-up fade-up-para-lg" activate="reveal"><?=$team_member->fields['content']['body']?></p>
									</div>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				</section>
			<?php endif; ?>
		<?php endforeach; ?>
	</div>

<?php

	get_footer();

?>
