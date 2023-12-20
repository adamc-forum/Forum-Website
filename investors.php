<?php

/* Template Name: Investors */

	// Get fields
	$page = get_fields();
    // Meta
        global $meta;
               $meta = ['title'			=> $page['meta'][0]['content']['title'],
                        'description'	=> $page['meta'][0]['content']['description'],
                        'image'			=> $page['meta'][0]['image'],
                        'url'			=> '/investors',
                        'footer'		=> 'grey'];
            
/* Header */
    get_header();

?>

<script>
    console.log(<?php echo json_encode($page); ?>);
</script>

<div class="bg-container" smoothscroll controller="investors" role="main">
    <section id="investors-hero" scroll="background" background="white" class="investors-background">
        <div class="container">
            <strong class="heading margin fade-up" scroll="reveal">Our Funds</strong>
            <h1 class="h1 pre button diagonal text-reveal" scroll="reveal"> Forum's Real Estate Funds </h1>
            
            <div class="flex">
                <p class="para lg fade-up" scroll="reveal"><?=$page['intro_section']['content_blocks']['headline']?></p>
                <div id="funds-container" class="para sm fade-up" scroll="reveal">
                    <?php foreach ($page['funds_content']['fund'] as $fund): ?>
                        <p class="para md"><?= htmlspecialchars($fund['name']) ?></p>
                        <div class="fund">
                            <figure class="fund-image">
                                <?php if ($fund['fund_icon']): ?>
                                    <img <?= srcset($fund['fund_icon'], 'large') ?>
                                        sizes="(min-width: 1023px) 20px, (min-width: 768px) 20px, 20px"
                                        alt="<?= htmlspecialchars($fund['name']) ?>" class="cover" scroll="image">
                                <?php endif; ?>
                            </figure>
                            <p class="para smc"><?= htmlspecialchars($fund['description']) ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
                <figure scroll="parallax" class="fade-up fade-up-para-lg hero-image">
                    <img <?=srcset($page['intro_section']['image_1'], 'large')?>
                         sizes="(min-width: 1023px) 46vw, (min-width: 768px) 41vw, 79vw"
                         alt="Impact and Community" class="cover" scroll="image">
                </figure>
            </div>
        </div>	
    </section>
</div>

<?php

get_footer();

?>