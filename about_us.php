<?php

	/* Template Name: About Us */

		// Get fields
			$page = get_fields();
				
		// Meta
			global $meta;
				   $meta = ['title'			=> $page['meta'][0]['content']['title'],
				   			'description'	=> $page['meta'][0]['content']['description'],
							'image'			=> $page['meta'][0]['image'],
							'url'			=> '/who-we-are'];
				
	/* Header */
		get_header();

?>

	<div class="bg-container" smoothscroll controller="about" role="main">
		<section id="about-hero" scroll="background" background="white" class="about-background">
			<div class="container">
				<strong class="heading margin fade-up" scroll="reveal">About Us</strong>
				<h1 class="h1 pre button diagonal text-reveal" scroll="reveal">Who
																			   We Are</h1>
																			   
				<figure scroll="reveal">
					<img <?=srcset($page['intro_section']['image_1'], '1536x1536')?>
						 sizes="(min-width: 1023px) 90vw, 100vw"
						 alt="Who We Are" class="cover" scroll="image">
				</figure>		
						
				<figure scroll="parallax">
					<img <?=srcset($page['intro_section']['image_2'], 'medium_large')?>
						 sizes="(min-width: 1023px) 35vw, (min-width: 768px) 47vw, 61vw"
						 alt="Who We Are" class="cover" scroll="image">
				</figure>
			</div>
		</section>
		
		<section id="about-overview" scroll="background" background="burgundy" class="about-background">
			<h2 class="heading center fade-up" scroll="reveal">Firm Overview</h2>
			<strong class="big-text" scroll="scrolling-text">Founded</strong>
			<strong class="big-text" scroll="scrolling-text">in 1996</strong>
	
			<div class="container">
				<div class="flex" id="overview1">
					<div class="content-block">
						<p class="para lg fade-up" scroll="reveal"><?=$page['firm_overview']['content_block_1']['heading']?></p>
						<figure scroll="parallax">
							<img <?=srcset($page['firm_overview']['content_block_1']['image'], 'medium_large')?>
								 sizes="(min-width: 1023px) 18vw, 80vw"
								 alt="<?=$page['firm_overview']['content_block_1']['heading']?>" class="cover" scroll="image">
						</figure>
						<p class="para sm fade-up" scroll="reveal"><?=$page['firm_overview']['content_block_1']['body']?></p>
					</div>
					<figure scroll="parallax">
						<img <?=srcset($page['firm_overview']['image_1'], 'large')?>
							 sizes="(min-width: 1023px) 45vw, (min-width: 768px) 41vw, 100vw"
							 alt="<?=$page['firm_overview']['content_block_1']['heading']?>" class="cover" scroll="image">
					</figure>
				</div>
			</div>
				
			<div class="ticker white" scroll="ticker">Forum is an Investor, Developer and Asset Manager</div>
			
			<div class="container">				
				<div class="flex" id="overview2">
					<p class="para lg fade-up" scroll="reveal"><?=$page['firm_overview']['content_block_2']['heading']?></p>
					<p class="para sm fade-up" scroll="reveal"><?=$page['firm_overview']['content_block_2']['body']?></p>
				
					<a href="<?=$page['firm_overview']['content_block_2']['esg_policy']['report']?>" class="button clickable inline diagonal text-reveal" scroll="reveal" target="_blank">
						<strong><?=$page['firm_overview']['content_block_2']['esg_policy']['button_text']?></strong>
					</a>
					<figure scroll="parallax">
						<img <?=srcset($page['firm_overview']['image_2'], 'large')?>
							 sizes="(min-width: 1023px) 37vw, (min-width: 768px) 32vw, 80vw"
							 alt="<?=$page['firm_overview']['content_block_2']['heading']?>" class="cover" scroll="image">
					</figure>
				</div>
				
				<div class="flex" id="overview3">
					<div class="content-block">
						<p class="para lg fade-up" scroll="reveal"><?=$page['firm_overview']['content_block_3']['heading']?></p>
						<p class="para sm fade-up" scroll="reveal"><?=$page['firm_overview']['content_block_3']['body']?></p>
					</div>
				</div>
				
				<a 
                href="<?=$page['firm_overview']['content_block_3']['impact_report']['report']['url']?>" 
                target="<?=$page['firm_overview']['content_block_3']['impact_report']['report']['target']?>" 
                class="button clickable inline diagonal text-reveal" scroll="reveal" target="_blank">
					<strong><?=$page['firm_overview']['content_block_3']['impact_report']['button_text']?></strong>
				</a>
			</div>
			
			<figure>
				<img <?=srcset($page['firm_overview']['image_3'], '1536x1536')?>
					 alt="<?=$page['firm_overview']['content_block_1']['heading']?>" class="cover" scroll="image">
			</figure>
		</section>
		
		<section id="about-expectations" scroll="background" background="white" class="about-background">
			<h2 class="heading center fade-up" scroll="reveal">What To Expect</h2>
			<div class="container">
				<strong class="h2 pre text-reveal" scroll="reveal"><?=$page['what_to_expect']['heading']?></strong>
				
				<div class="images">
					<figure scroll="parallax">
						<img <?=srcset($page['what_to_expect']['images']['image_1'], '1536x1536')?>
							 sizes="(min-width: 1023px) 75vw, (min-width: 768px) 82vw, 96vw"
							 alt="What To Expect" class="cover" scroll="image">
					</figure>
					<figure scroll="parallax">
						<img <?=srcset($page['what_to_expect']['images']['image_2'], 'large')?>
							 sizes="(min-width: 1023px) 27vw, (min-width: 768px) 16vw"
							 alt="What To Expect" class="cover" scroll="image">
					</figure>
				</div>
			</div>
			
			<ul>
				<?php foreach ($page['what_to_expect']['expectations'] as $key => $expectation): ?>
					<li class="<?=!$key ? 'active' : false?> fade-up fade-up-para-lg" style="--animation-delay: <?=($key + 1) * .2?>s;" scroll="reveal">
						<button type="button" action="accordion" class="h3" aria-label="<?=$expectation['title']?>"><?=$expectation['title']?><span></span></button>
						<div class="accordion-outer">
							<div class="accordion-inner">
								<p class="para sm"><?=$expectation['expectation']?></p>
							</div>
						</div>
					</li>
				<?php endforeach; ?>
			</ul>
			
			<a href="/impact-and-community" class="button clickable inline diagonal text-reveal" scroll="reveal">
				<strong>Learn More
						About
						Forum's
						Impact &
						Community</strong>
			</a>
		</section>
	</div>
	
<?php

	get_footer();
